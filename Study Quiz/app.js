(() => {
  "use strict";

  const questions = Array.isArray(window.QUIZ_QUESTIONS) ? window.QUIZ_QUESTIONS : [];
  const storageKey = "earth123-study-quiz-v1";
  const moduleNames = {
    2: "Hydrology + watersheds",
    3: "Precipitation",
    4: "Precipitation data",
    5: "Evaporation + transpiration",
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
    reshuffleButton: document.querySelector("#reshuffleButton"),
    resetButton: document.querySelector("#resetButton"),
    questionPosition: document.querySelector("#questionPosition"),
    progressFill: document.querySelector("#progressFill"),
    correctStat: document.querySelector("#correctStat"),
    attemptStat: document.querySelector("#attemptStat"),
    streakStat: document.querySelector("#streakStat"),
    accuracyStat: document.querySelector("#accuracyStat"),
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
  };

  const availableModules = [...new Set(questions.map((question) => question.module))].sort((a, b) => a - b);
  let state = loadState();
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
        currentSolved: Boolean(stored.currentSolved),
      };
    } catch {
      return defaultState();
    }
  }

  function saveState() {
    localStorage.setItem(storageKey, JSON.stringify(state));
  }

  function currentQuestion() {
    const id = state.order[state.index];
    return questions.find((question) => question.id === id);
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
    elements.sourceLabel.textContent = `Quiz ${question.quiz}, question ${question.quizQuestion}`;
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
      button.innerHTML = `<img src="${src}" alt="Course figure for quiz ${question.quiz}, question ${question.quizQuestion}${question.images.length > 1 ? `, image ${index + 1}` : ""}">`;
      button.addEventListener("click", () => openImage(src));
      elements.questionMedia.append(button);
    });

    question.options.forEach((option, index) => {
      const label = document.createElement("label");
      label.className = "answer-option";
      if (wrongOptions.has(index)) label.classList.add("is-wrong");
      if (state.currentSolved && index === question.answer) label.classList.add("is-correct");
      const marker = String.fromCharCode(65 + index);
      label.innerHTML = `
        <input type="radio" name="answer" value="${index}" ${state.currentSolved ? "disabled" : ""}>
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
    elements.questionPosition.textContent = `${state.order.length} / ${state.order.length}`;
    elements.progressFill.style.width = "100%";
    elements.completionSummary.textContent = `${state.correct} questions solved in ${state.attempts} attempts. Session accuracy: ${accuracy}%.`;
  }

  function renderAll() {
    renderModuleFilters();
    renderStats();
    renderQuestion();
  }

  function showCorrectFeedback(question) {
    elements.feedback.className = "feedback is-success";
    elements.feedback.innerHTML = `<strong>Correct.</strong> ${question.explanation}`;
  }

  function selectedAnswer() {
    const selected = elements.answerForm.querySelector('input[name="answer"]:checked');
    return selected ? Number(selected.value) : null;
  }

  function checkAnswer(event) {
    event.preventDefault();
    if (state.currentSolved) return;
    const selected = selectedAnswer();
    if (selected === null) {
      elements.feedback.className = "feedback is-warning";
      elements.feedback.textContent = "Select an answer before checking.";
      return;
    }

    const question = currentQuestion();
    state.attempts += 1;
    if (selected === question.answer) {
      state.correct += 1;
      state.streak += 1;
      state.currentSolved = true;
      saveState();
      renderStats();
      renderQuestion();
      elements.nextButton.focus();
      return;
    }

    state.streak = 0;
    wrongOptions.add(selected);
    saveState();
    renderStats();
    const option = elements.answerList.children[selected];
    option?.classList.add("is-wrong");
    elements.feedback.className = "feedback is-error";
    elements.feedback.innerHTML = "<strong>Not correct.</strong> Review the choices and try again.";
  }

  function nextQuestion() {
    if (!state.currentSolved) return;
    state.index += 1;
    state.currentSolved = false;
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
    if (!window.confirm("Reset the current session and all saved progress?")) return;
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

  elements.answerForm.addEventListener("submit", checkAnswer);
  elements.nextButton.addEventListener("click", nextQuestion);
  elements.applyFiltersButton.addEventListener("click", applyFilters);
  elements.selectAllButton.addEventListener("click", toggleAllModules);
  elements.reshuffleButton.addEventListener("click", () => createSession(state.selectedModules));
  elements.restartButton.addEventListener("click", () => createSession(state.selectedModules));
  elements.resetButton.addEventListener("click", resetProgress);
  elements.dialogCloseButton.addEventListener("click", () => elements.imageDialog.close());
  elements.imageDialog.addEventListener("click", (event) => {
    if (event.target === elements.imageDialog) elements.imageDialog.close();
  });
  document.addEventListener("keydown", (event) => {
    if (elements.imageDialog.open && event.key === "Escape") return;
    const number = Number(event.key);
    if (number >= 1 && number <= 9 && !state.currentSolved) {
      const input = elements.answerList.querySelector(`input[value="${number - 1}"]`);
      if (input) input.checked = true;
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
