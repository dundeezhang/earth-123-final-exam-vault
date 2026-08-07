(() => {
  "use strict";

  const questions = Array.isArray(window.QUIZ_QUESTIONS) ? window.QUIZ_QUESTIONS : [];
  const storageKey = "earth123-study-quiz-v2";
  const missedStorageKey = "earth123-missed-questions-v1";
  const moduleNames = {
    1: "Course foundations",
    2: "Hydrology + watersheds",
    3: "Precipitation",
    4: "Precipitation data",
    5: "Evaporation + transpiration",
    6: "Measuring evapotranspiration",
    7: "Water balance",
    8: "Soils",
    9: "Groundwater",
    10: "Surface water + runoff",
    11: "Glaciers",
    12: "Climate change",
  };

  const elements = {
    moduleList: document.querySelector("#moduleList"),
    selectAllButton: document.querySelector("#selectAllButton"),
    applyFiltersButton: document.querySelector("#applyFiltersButton"),
    missedButton: document.querySelector("#missedButton"),
    missedCount: document.querySelector("#missedCount"),
    reshuffleButton: document.querySelector("#reshuffleButton"),
    resetButton: document.querySelector("#resetButton"),
    questionPosition: document.querySelector("#questionPosition"),
    progressFill: document.querySelector("#progressFill"),
    correctStat: document.querySelector("#correctStat"),
    attemptStat: document.querySelector("#attemptStat"),
    streakStat: document.querySelector("#streakStat"),
    accuracyStat: document.querySelector("#accuracyStat"),
    examMarkStat: document.querySelector("#examMarkStat"),
    questionView: document.querySelector("#questionView"),
    completionView: document.querySelector("#completionView"),
    completionSummary: document.querySelector("#completionSummary"),
    restartButton: document.querySelector("#restartButton"),
    moduleBadge: document.querySelector("#moduleBadge"),
    sourceLabel: document.querySelector("#sourceLabel"),
    questionPrompt: document.querySelector("#questionPrompt"),
    questionMedia: document.querySelector("#questionMedia"),
    answerForm: document.querySelector("#answerForm"),
    answerList: document.querySelector("#answerList"),
    feedback: document.querySelector("#feedback"),
    checkButton: document.querySelector("#checkButton"),
    nextButton: document.querySelector("#nextButton"),
    imageDialog: document.querySelector("#imageDialog"),
    dialogImage: document.querySelector("#dialogImage"),
    dialogCloseButton: document.querySelector("#dialogCloseButton"),
    reviewDialog: document.querySelector("#reviewDialog"),
    reviewCloseButton: document.querySelector("#reviewCloseButton"),
    studyMissedButton: document.querySelector("#studyMissedButton"),
    exportMissedButton: document.querySelector("#exportMissedButton"),
    clearMissedButton: document.querySelector("#clearMissedButton"),
    reviewEmpty: document.querySelector("#reviewEmpty"),
    missedList: document.querySelector("#missedList"),
  };

  const availableModules = [...new Set(questions.map((question) => question.module))].sort((a, b) => a - b);
  let state = loadState();
  let missedLog = loadMissedLog();
  let wrongOptions = new Set();

  function shuffle(values) {
    const output = [...values];
    for (let index = output.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [output[index], output[swapIndex]] = [output[swapIndex], output[index]];
    }
    return output;
  }

  function defaultState() {
    const selectedModules = [...availableModules];
    return {
      selectedModules,
      order: shuffle(questions.filter((question) => selectedModules.includes(question.module)).map((question) => question.id)),
      index: 0,
      correct: 0,
      attempts: 0,
      streak: 0,
      examPoints: 0,
      examTotal: 0,
      currentFirstAttemptRecorded: false,
      currentSolved: false,
    };
  }

  function loadState() {
    try {
      const stored = JSON.parse(localStorage.getItem(storageKey));
      if (!stored || !Array.isArray(stored.order) || !Array.isArray(stored.selectedModules)) return defaultState();
      const validIds = new Set(questions.map((question) => question.id));
      if (!stored.order.length || stored.order.some((id) => !validIds.has(id))) return defaultState();
      return {
        ...defaultState(),
        ...stored,
        index: Math.min(Math.max(0, stored.index ?? 0), stored.order.length),
        examPoints: Math.max(0, stored.examPoints ?? 0),
        examTotal: Math.max(0, stored.examTotal ?? 0),
        currentFirstAttemptRecorded: Boolean(stored.currentFirstAttemptRecorded),
        currentSolved: Boolean(stored.currentSolved),
      };
    } catch {
      return defaultState();
    }
  }

  function saveState() {
    localStorage.setItem(storageKey, JSON.stringify(state));
  }

  function loadMissedLog() {
    try {
      const stored = JSON.parse(localStorage.getItem(missedStorageKey));
      return stored && typeof stored === "object" && !Array.isArray(stored) ? stored : {};
    } catch {
      return {};
    }
  }

  function saveMissedLog() {
    localStorage.setItem(missedStorageKey, JSON.stringify(missedLog));
  }

  function plainText(html) {
    const node = document.createElement("div");
    node.innerHTML = html ?? "";
    return (node.textContent ?? "").replace(/\s+/g, " ").trim();
  }

  function currentQuestion() {
    const id = state.order[state.index];
    return questions.find((question) => question.id === id);
  }

  function correctAnswers(question) {
    return Array.isArray(question.answers) && question.answers.length ? question.answers : [question.answer];
  }

  function isMultipleChoice(question) {
    return question.selectionMode === "multiple" || correctAnswers(question).length > 1;
  }

  function sameAnswerSet(selected, correct) {
    return selected.length === correct.length && selected.every((answer) => correct.includes(answer));
  }

  function createSession(selectedModules) {
    const pool = questions.filter((question) => selectedModules.includes(question.module));
    state = {
      selectedModules: [...selectedModules],
      order: shuffle(pool.map((question) => question.id)),
      index: 0,
      correct: 0,
      attempts: 0,
      streak: 0,
      examPoints: 0,
      examTotal: 0,
      currentFirstAttemptRecorded: false,
      currentSolved: false,
    };
    wrongOptions = new Set();
    saveState();
    renderAll();
  }

  function createSessionFromIds(ids) {
    const validIds = new Set(questions.map((question) => question.id));
    const poolIds = ids.filter((id) => validIds.has(id));
    if (!poolIds.length) return;
    const selectedModules = [...new Set(
      questions.filter((question) => poolIds.includes(question.id)).map((question) => question.module),
    )].sort((a, b) => a - b);
    state = {
      selectedModules,
      order: shuffle(poolIds),
      index: 0,
      correct: 0,
      attempts: 0,
      streak: 0,
      examPoints: 0,
      examTotal: 0,
      currentFirstAttemptRecorded: false,
      currentSolved: false,
    };
    wrongOptions = new Set();
    saveState();
    renderAll();
  }

  function renderModuleFilters() {
    elements.moduleList.replaceChildren();
    for (const module of availableModules) {
      const count = questions.filter((question) => question.module === module).length;
      const label = document.createElement("label");
      label.className = "module-toggle";
      label.innerHTML = `
        <input type="checkbox" value="${module}" ${state.selectedModules.includes(module) ? "checked" : ""}>
        <span>Module ${module}: ${moduleNames[module]}</span>
        <span>${count}</span>
      `;
      elements.moduleList.append(label);
    }
    const allSelected = availableModules.every((module) => state.selectedModules.includes(module));
    elements.selectAllButton.textContent = allSelected ? "Clear all" : "Select all";
  }

  function renderStats() {
    const total = state.order.length;
    const shownPosition = Math.min(state.index + 1, total);
    const completed = Math.min(state.index, total);
    const accuracy = state.attempts ? Math.round((state.correct / state.attempts) * 100) : 0;
    elements.questionPosition.textContent = `${shownPosition} / ${total}`;
    elements.progressFill.style.width = `${total ? (completed / total) * 100 : 0}%`;
    elements.correctStat.textContent = state.correct;
    elements.attemptStat.textContent = state.attempts;
    elements.streakStat.textContent = state.streak;
    elements.accuracyStat.textContent = `${accuracy}%`;
    const examPercent = state.examTotal ? Math.round((state.examPoints / state.examTotal) * 100) : 0;
    elements.examMarkStat.textContent = `${state.examPoints} / ${state.examTotal} (${examPercent}%)`;
  }

  function sortedMissedEntries() {
    return Object.values(missedLog).sort((a, b) => (
      b.misses - a.misses || new Date(b.lastMissed) - new Date(a.lastMissed)
    ));
  }

  function renderMissedCount() {
    elements.missedCount.textContent = String(Object.keys(missedLog).length);
  }

  function renderMissedDialog() {
    const entries = sortedMissedEntries();
    elements.reviewEmpty.hidden = entries.length > 0;
    elements.missedList.replaceChildren();
    elements.studyMissedButton.disabled = entries.length === 0;
    elements.exportMissedButton.disabled = entries.length === 0;
    elements.clearMissedButton.disabled = entries.length === 0;

    for (const entry of entries) {
      const article = document.createElement("article");
      article.className = "missed-item";

      const meta = document.createElement("div");
      meta.className = "missed-item-meta";
      const source = document.createElement("span");
      source.textContent = `Module ${entry.module} · ${entry.sourceLabel}`;
      const count = document.createElement("strong");
      count.textContent = `${entry.misses} ${entry.misses === 1 ? "miss" : "misses"}`;
      meta.append(source, count);

      const heading = document.createElement("h3");
      heading.textContent = entry.prompt;

      const wrongHeading = document.createElement("h4");
      wrongHeading.textContent = "Answers chosen";
      const wrongList = document.createElement("ul");
      wrongList.className = "missed-answer-list";
      Object.entries(entry.wrongAnswers ?? {})
        .sort(([, first], [, second]) => second - first)
        .forEach(([answer, answerCount]) => {
          const item = document.createElement("li");
          item.textContent = `${answer} (${answerCount}×)`;
          wrongList.append(item);
        });

      const correct = document.createElement("p");
      correct.className = "missed-correct-answer";
      const correctLabel = document.createElement("strong");
      correctLabel.textContent = "Correct answer: ";
      correct.append(correctLabel, entry.correctAnswer);

      const explanation = document.createElement("p");
      explanation.className = "missed-explanation";
      explanation.textContent = entry.explanation;

      article.append(meta, heading, wrongHeading, wrongList, correct, explanation);
      elements.missedList.append(article);
    }
  }

  function renderQuestion() {
    const question = currentQuestion();
    if (!question) {
      renderCompletion();
      return;
    }

    elements.questionView.hidden = false;
    elements.completionView.hidden = true;
    elements.moduleBadge.textContent = `Module ${question.module}`;
    elements.sourceLabel.textContent = question.sourceLabel;
    elements.questionPrompt.innerHTML = question.prompt;
    elements.questionMedia.replaceChildren();
    elements.answerList.replaceChildren();
    elements.feedback.className = "feedback";
    elements.feedback.replaceChildren();
    elements.checkButton.disabled = state.currentSolved;
    elements.nextButton.disabled = !state.currentSolved;

    question.images.forEach((src, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "image-button";
      button.title = "Open figure";
      button.innerHTML = `<img src="${src}" alt="Course figure for ${question.sourceLabel}${question.images.length > 1 ? `, image ${index + 1}` : ""}">`;
      button.addEventListener("click", () => openImage(src));
      elements.questionMedia.append(button);
    });

    question.options.forEach((option, index) => {
      const label = document.createElement("label");
      label.className = "answer-option";
      if (wrongOptions.has(index)) label.classList.add("is-wrong");
      if (state.currentSolved && correctAnswers(question).includes(index)) label.classList.add("is-correct");
      const marker = String.fromCharCode(65 + index);
      const inputType = isMultipleChoice(question) ? "checkbox" : "radio";
      label.innerHTML = `
        <input type="${inputType}" name="answer" value="${index}" ${state.currentSolved ? "disabled" : ""}>
        <span class="answer-marker" aria-hidden="true">${marker}</span>
        <span class="answer-text">${option}</span>
      `;
      elements.answerList.append(label);
    });

    if (state.currentSolved) showCorrectFeedback(question);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function renderCompletion() {
    elements.questionView.hidden = true;
    elements.completionView.hidden = false;
    const accuracy = state.attempts ? Math.round((state.correct / state.attempts) * 100) : 0;
    const examPercent = state.examTotal ? Math.round((state.examPoints / state.examTotal) * 100) : 0;
    elements.questionPosition.textContent = `${state.order.length} / ${state.order.length}`;
    elements.progressFill.style.width = "100%";
    elements.completionSummary.textContent = `${state.correct} questions solved in ${state.attempts} attempts. Session accuracy: ${accuracy}%. First-attempt exam mark: ${state.examPoints}/${state.examTotal} (${examPercent}%).`;
  }

  function renderAll() {
    renderModuleFilters();
    renderStats();
    renderMissedCount();
    renderQuestion();
  }

  function recordMissedQuestion(question, selected) {
    const chosenAnswer = selected.length
      ? selected.map((answer) => plainText(question.options[answer])).join("; ")
      : "No answer selected";
    const existing = missedLog[question.id];
    const wrongAnswers = { ...(existing?.wrongAnswers ?? {}) };
    wrongAnswers[chosenAnswer] = (wrongAnswers[chosenAnswer] ?? 0) + 1;
    missedLog[question.id] = {
      id: question.id,
      module: question.module,
      sourceLabel: question.sourceLabel,
      prompt: plainText(question.prompt),
      correctAnswer: correctAnswers(question).map((answer) => plainText(question.options[answer])).join("; "),
      explanation: plainText(question.explanation),
      misses: (existing?.misses ?? 0) + 1,
      wrongAnswers,
      lastMissed: new Date().toISOString(),
    };
    saveMissedLog();
    renderMissedCount();
  }

  function showCorrectFeedback(question) {
    elements.feedback.className = "feedback is-success";
    elements.feedback.innerHTML = `<strong>Correct.</strong> ${question.explanation}`;
  }

  function selectedAnswers() {
    return [...elements.answerForm.querySelectorAll('input[name="answer"]:checked')].map((input) => Number(input.value));
  }

  function checkAnswer(event) {
    event.preventDefault();
    if (state.currentSolved) return;
    const selected = selectedAnswers();
    if (!selected.length) {
      elements.feedback.className = "feedback is-warning";
      elements.feedback.textContent = isMultipleChoice(currentQuestion())
        ? "Select every answer that applies before checking."
        : "Select an answer before checking.";
      return;
    }

    const question = currentQuestion();
    state.attempts += 1;
    const isFirstAttempt = !state.currentFirstAttemptRecorded;
    if (isFirstAttempt) {
      state.examTotal += 1;
      state.currentFirstAttemptRecorded = true;
    }
    const correct = correctAnswers(question);
    if (sameAnswerSet(selected, correct)) {
      state.correct += 1;
      state.streak += 1;
      if (isFirstAttempt) state.examPoints += 1;
      state.currentSolved = true;
      saveState();
      renderStats();
      renderQuestion();
      elements.nextButton.focus();
      return;
    }

    state.streak = 0;
    selected.filter((answer) => !correct.includes(answer)).forEach((answer) => wrongOptions.add(answer));
    recordMissedQuestion(question, selected);
    saveState();
    renderStats();
    selected
      .filter((answer) => !correct.includes(answer))
      .forEach((answer) => elements.answerList.children[answer]?.classList.add("is-wrong"));
    elements.feedback.className = "feedback is-error";
    elements.feedback.innerHTML = "<strong>Not correct.</strong> Added to the missed-question log. Review the choices and try again.";
  }

  function nextQuestion() {
    if (!state.currentSolved) return;
    state.index += 1;
    state.currentSolved = false;
    state.currentFirstAttemptRecorded = false;
    wrongOptions = new Set();
    saveState();
    renderStats();
    renderQuestion();
  }

  function selectedFilterModules() {
    return [...elements.moduleList.querySelectorAll('input[type="checkbox"]:checked')].map((input) => Number(input.value));
  }

  function applyFilters() {
    const selected = selectedFilterModules();
    if (!selected.length) {
      elements.selectAllButton.focus();
      return;
    }
    createSession(selected);
  }

  function toggleAllModules() {
    const checkboxes = [...elements.moduleList.querySelectorAll('input[type="checkbox"]')];
    const shouldSelect = checkboxes.some((checkbox) => !checkbox.checked);
    checkboxes.forEach((checkbox) => {
      checkbox.checked = shouldSelect;
    });
    elements.selectAllButton.textContent = shouldSelect ? "Clear all" : "Select all";
  }

  function resetProgress() {
    if (!window.confirm("Reset the current session and saved progress? The missed-question log will be kept.")) return;
    localStorage.removeItem(storageKey);
    state = defaultState();
    wrongOptions = new Set();
    saveState();
    renderAll();
  }

  function openImage(src) {
    elements.dialogImage.src = src;
    elements.imageDialog.showModal();
  }

  function openMissedDialog() {
    renderMissedDialog();
    elements.reviewDialog.showModal();
  }

  function studyMissed() {
    const ids = sortedMissedEntries().map((entry) => entry.id);
    if (!ids.length) return;
    elements.reviewDialog.close();
    createSessionFromIds(ids);
  }

  function markdownText(value) {
    return String(value ?? "").replace(/([\\`*_{}\[\]<>#+|])/g, "\\$1");
  }

  function exportMissedMarkdown() {
    const entries = sortedMissedEntries().sort((a, b) => a.module - b.module || b.misses - a.misses);
    if (!entries.length) return;
    const lines = [
      "# EARTH 123 Missed Questions",
      "",
      `Exported: ${new Date().toLocaleString()}`,
      "",
      `Unique questions missed: ${entries.length}`,
      `Total incorrect attempts: ${entries.reduce((sum, entry) => sum + entry.misses, 0)}`,
      "",
    ];
    let currentModule = null;
    for (const entry of entries) {
      if (entry.module !== currentModule) {
        currentModule = entry.module;
        lines.push(`## Module ${currentModule}: ${moduleNames[currentModule] ?? "Review"}`, "");
      }
      const wrongAnswers = Object.entries(entry.wrongAnswers ?? {})
        .sort(([, first], [, second]) => second - first)
        .map(([answer, count]) => `${markdownText(answer)} (${count}x)`)
        .join(", ");
      lines.push(
        `### ${markdownText(entry.prompt)}`,
        "",
        `- Source: ${markdownText(entry.sourceLabel)}`,
        `- Misses: ${entry.misses}`,
        `- Incorrect answers chosen: ${wrongAnswers}`,
        `- Correct answer: ${markdownText(entry.correctAnswer)}`,
        `- Explanation: ${markdownText(entry.explanation)}`,
        "",
      );
    }
    const blob = new Blob([lines.join("\n")], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "EARTH-123-missed-questions.md";
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function clearMissedLog() {
    if (!window.confirm("Clear the full missed-question log?")) return;
    missedLog = {};
    localStorage.removeItem(missedStorageKey);
    renderMissedCount();
    renderMissedDialog();
  }

  elements.answerForm.addEventListener("submit", checkAnswer);
  elements.nextButton.addEventListener("click", nextQuestion);
  elements.applyFiltersButton.addEventListener("click", applyFilters);
  elements.selectAllButton.addEventListener("click", toggleAllModules);
  elements.reshuffleButton.addEventListener("click", () => createSession(state.selectedModules));
  elements.restartButton.addEventListener("click", () => createSession(state.selectedModules));
  elements.resetButton.addEventListener("click", resetProgress);
  elements.missedButton.addEventListener("click", openMissedDialog);
  elements.studyMissedButton.addEventListener("click", studyMissed);
  elements.exportMissedButton.addEventListener("click", exportMissedMarkdown);
  elements.clearMissedButton.addEventListener("click", clearMissedLog);
  elements.reviewCloseButton.addEventListener("click", () => elements.reviewDialog.close());
  elements.dialogCloseButton.addEventListener("click", () => elements.imageDialog.close());
  elements.imageDialog.addEventListener("click", (event) => {
    if (event.target === elements.imageDialog) elements.imageDialog.close();
  });
  elements.reviewDialog.addEventListener("click", (event) => {
    if (event.target === elements.reviewDialog) elements.reviewDialog.close();
  });
  document.addEventListener("keydown", (event) => {
    if (elements.imageDialog.open && event.key === "Escape") return;
    const number = Number(event.key);
    if (number >= 1 && number <= 9 && !state.currentSolved) {
      const input = elements.answerList.querySelector(`input[value="${number - 1}"]`);
      if (input) input.checked = input.type === "checkbox" ? !input.checked : true;
    }
    if (event.key === "Enter" && state.currentSolved) {
      event.preventDefault();
      nextQuestion();
    }
  });

  if (!questions.length) {
    elements.questionPrompt.textContent = "Question data could not be loaded.";
  } else {
    renderAll();
  }
})();
