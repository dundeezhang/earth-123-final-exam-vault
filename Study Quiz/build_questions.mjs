import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SITE_DIR = path.dirname(fileURLToPath(import.meta.url));
const VAULT_DIR = path.resolve(SITE_DIR, "..");
const MODULES_DIR = path.join(VAULT_DIR, "Modules");
const ASSET_DIR = path.join(SITE_DIR, "assets");

const MANUAL = {
  "quiz-4-q1": {
    options: ["40%", "20%", "60%", "250%"],
    answers: [0],
  },
  "quiz-7-q3": {
    options: [
      "B = Precipitation; E = Groundwater out; C = Evaporation; D = Surface water out; A = Groundwater in",
      "B = Evaporation; E = Groundwater in; C = Precipitation; D = Groundwater out; A = Surface water out",
      "B = Surface water out; E = Evaporation; C = Groundwater in; D = Precipitation; A = Groundwater out",
      "B = Groundwater in; E = Surface water out; C = Groundwater out; D = Evaporation; A = Precipitation",
    ],
    answers: [0],
  },
  "quiz-7-q6": {
    options: ["20,009 m³", "19,991 m³", "20,900 m³", "4,009 m³"],
    answers: [0],
  },
  "quiz-7-q7": {
    options: ["60,008 m³", "59,992 m³", "12,008 m³", "60,800 m³"],
    answers: [0],
  },
  "quiz-7-q8": {
    options: ["16 mm", "8 mm", "31 mm", "155 mm"],
    answers: [0],
  },
};

const PRACTICE_IMAGES = {
  "practice-m2-q8": ["Assets/Module 02/2.2-hydrograph.png"],
  "practice-m2-q20": ["Assets/Module 02/2.2-hydrograph.png"],
  "practice-m3-q4": ["Assets/Module 03/3.1-canada-relief.png"],
  "practice-m4-q8": ["Assets/Module 04/isohyetal-contour-map-precipitation-depths_5.png"],
  "practice-m4-q16": ["Assets/Module 04/drainage-basin_5.jpg"],
  "practice-m9-q1": ["Assets/Module 09/9-1-hydrological-cycle.png"],
  "practice-m9-q2": ["Assets/Module 09/9-3-1-water-table-valley.png"],
  "practice-m9-q12": ["Assets/Module 09/9-5-2-stream-interactions.png"],
  "practice-m10-q3": ["Assets/Module 10/urbanization-hydrograph.png"],
  "practice-m10-q15": ["Assets/Module 10/fig-10.4.2-flood-hydrograph.jpeg"],
  "practice-m11-q15": ["Assets/Module 11/11.2.1-valley-glacier-movement.png"],
  "practice-m11-q17": ["Assets/Module 11/11.2.4-milankovitch-solar-forcing.png"],
  "practice-m12-q11": ["Assets/Module 12/12.2.7-annual-ocean-heat-content.png"],
  "practice-m12-q19": ["Assets/Module 12/12.2.7-annual-ocean-heat-content.png"],
  "practice-m12-q22": ["Assets/Module 12/12.2.1-keeling-curve.png"],
  "practice-m12-q25": [
    "Assets/Module 12/12.2.9-major-atlantic-hurricanes.jpeg",
    "Assets/Module 12/12.2.10-us-tornadoes.png",
  ],
};

function htmlEscape(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function inlineMarkdown(value) {
  let result = value.trim();
  result = result.replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, "$2");
  result = result.replace(/\[\[([^\]]+)\]\]/g, "$1");
  result = result.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
  result = result.replace(/\$([^$]+)\$/g, "$1");
  result = result.replace(/\\text\{([^}]+)\}/g, "$1");
  result = result.replace(/\\mathrm\{([^}]+)\}/g, "$1");
  result = result.replace(/\\(?:dfrac|frac)\{([^}]+)\}\{([^}]+)\}/g, "$1/$2");
  result = result.replace(/\\times/g, "×").replace(/\\approx/g, "≈");
  result = result.replace(/\\leq?/g, "≤").replace(/\\geq?/g, "≥");
  result = result.replace(/\\Delta/g, "Δ").replace(/\\sum/g, "Σ");
  result = result.replace(/\\rho/g, "ρ").replace(/\{,\}/g, ",");
  result = result.replace(/\^\\circ/g, "°");
  result = result.replace(/\\circ/g, "°").replace(/\\pm/g, "±");
  result = result.replace(/\\_/g, "_").replace(/\\%/g, "%");
  result = result.replace(/\^\{([^}]+)\}/g, "<sup>$1</sup>");
  result = result.replace(/_\{([^}]+)\}/g, "<sub>$1</sub>");
  result = result.replace(/\^([A-Za-z0-9+\-]+)/g, "<sup>$1</sup>");
  result = result.replace(/_([A-Za-z0-9+\-]+)/g, "<sub>$1</sub>");
  result = result.replace(/\\[,;!]/g, " ").replace(/\\/g, "");
  result = result.replace(/Δ\s+S/g, "ΔS").replace(/Δ\s+h/g, "Δh").replace(/×\s+/g, "×");
  result = result.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  result = result.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  return result;
}

function stripOptionPrefix(value) {
  return value.replace(/^\s*(?:[A-Za-z]|\d+)[.)]\s+/, "").trim();
}

function cleanPromptLine(value) {
  return value
    .replace(/\s*©.*$/i, "")
    .replace(/\s*\(Dingman,\s*2002,\s*p\.?\s*12\)\s*$/i, "")
    .trim();
}

function plainText(value) {
  return inlineMarkdown(value)
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function findQuizBanks() {
  return fs
    .readdirSync(MODULES_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(MODULES_DIR, entry.name, "99 - Quiz Bank.md"))
    .filter((file) => fs.existsSync(file));
}

function parseAnswerLines(markdown) {
  const details = markdown.match(/<details>[\s\S]*?<summary>Answer key<\/summary>([\s\S]*?)<\/details>/);
  const answers = new Map();
  if (!details) return answers;
  for (const line of details[1].split("\n")) {
    const standard = line.match(/^(\d+)\.\s+(.+)/);
    if (standard) {
      answers.set(Number(standard[1]), standard[2].trim());
      continue;
    }
    const fullyBold = line.match(/^\*\*(\d+)\.\s+([^*]+)\*\*(.*)/);
    if (fullyBold) {
      answers.set(Number(fullyBold[1]), `**${fullyBold[2].trim()}**${fullyBold[3]}`);
    }
  }
  return answers;
}

function answersFromOptions(options, answerLine) {
  const leadMatch = answerLine?.match(/^\*\*([^*]+)\*\*/);
  const lead = plainText(leadMatch?.[1] ?? answerLine ?? "");
  const normalizedOptions = options.map((option) => plainText(option).toLowerCase());

  if (/^(true|false)\b/i.test(lead)) {
    return [normalizedOptions.findIndex((option) => option === lead.match(/^(true|false)/i)[1].toLowerCase())];
  }

  const optionsUseLetters = normalizedOptions.every((option) => /^[a-z][.)]/i.test(option));
  const multipleLetterMatch = lead.match(/^([A-F](?:(?:,\s*(?:and\s*)?|\s+and\s+)[A-F])+)[.)]?(?=\s|$)/);
  const singleLetterMatch = lead.match(/^([A-Fa-f])(?:[.)]|,|\s)/);
  const leadingLetters = multipleLetterMatch?.[1] ?? singleLetterMatch?.[1] ?? "";
  const letters = [...leadingLetters.matchAll(/\b([A-Fa-f])\b/g)].map((match) => match[1].toLowerCase());
  if (optionsUseLetters && letters.length) {
    return letters.map((letter) =>
      normalizedOptions.findIndex((option) => option.startsWith(`${letter})`) || option.startsWith(`${letter}.`)),
    );
  }

  const cleanedLead = lead.replace(/^[a-z][.)]\s*/i, "").replace(/[.,]$/, "").toLowerCase();
  return [normalizedOptions.findIndex((option) => {
    const cleanedOption = option.replace(/^[a-z0-9]+[.)]\s*/i, "").replace(/[.,]$/, "");
    return cleanedOption === cleanedLead || cleanedLead.startsWith(cleanedOption);
  })];
}

function questionAnswerFields(answers) {
  const uniqueAnswers = [...new Set(answers)];
  return {
    answer: uniqueAnswers[0],
    answers: uniqueAnswers,
    selectionMode: uniqueAnswers.length > 1 ? "multiple" : "single",
  };
}

function copyQuestionImage(sourceFile, markdownPath, questionId) {
  const source = path.resolve(path.dirname(sourceFile), decodeURIComponent(markdownPath));
  return copyImage(source, questionId);
}

function copyImage(source, questionId) {
  if (!fs.existsSync(source)) throw new Error(`Missing image: ${source}`);
  fs.mkdirSync(ASSET_DIR, { recursive: true });
  const outputName = `${questionId}-${path.basename(source).replace(/[^a-zA-Z0-9._-]+/g, "-")}`;
  const output = path.join(ASSET_DIR, outputName);
  fs.copyFileSync(source, output);
  return `assets/${outputName}`;
}

function practiceImages(questionId) {
  return (PRACTICE_IMAGES[questionId] ?? []).map((relativePath) =>
    copyImage(path.join(VAULT_DIR, relativePath), questionId),
  );
}

function parseQuestionBlock(block, sourceFile, moduleNumber, answers) {
  const lines = block.split("\n");
  const header = lines.shift();
  const match = header.match(/^(\d+)\.\s+\*\*Saved quiz-(\d+), Question (\d+)\.\*\*\s*(.*)$/);
  if (!match) return null;

  const bankNumber = Number(match[1]);
  const quizNumber = Number(match[2]);
  const quizQuestion = Number(match[3]);
  const id = `quiz-${quizNumber}-q${quizQuestion}`;
  const promptLines = match[4] ? [cleanPromptLine(match[4])] : [];
  const options = [];
  const images = [];
  let skipCaption = false;

  for (const line of lines) {
    const image = line.match(/^\s*!\[[^\]]*\]\(([^)]+)\)/);
    if (image) {
      images.push(copyQuestionImage(sourceFile, image[1], id));
      skipCaption = true;
      continue;
    }
    if (skipCaption && /^\s*\*[^*].*\*\s*$/.test(line)) continue;
    if (/^\s*\*\*What to notice:\*\*/.test(line)) {
      skipCaption = false;
      continue;
    }
    const option = line.match(/^\s+-\s+(.+)/);
    if (option) {
      options.push(option[1].trim());
      continue;
    }
    if (line.trim()) promptLines.push(cleanPromptLine(line));
  }

  const manual = MANUAL[id];
  const finalOptions = manual?.options ?? options;
  const answerLine = answers.get(bankNumber) ?? "";
  const answerFields = questionAnswerFields(manual?.answers ?? answersFromOptions(finalOptions, answerLine));
  const prompt = promptLines
    .filter((line) => !/^\*[^*].*\*$/.test(line))
    .map(inlineMarkdown)
    .join("<br>");

  return {
    id,
    module: moduleNumber,
    quiz: quizNumber,
    quizQuestion,
    sourceType: "official",
    sourceLabel: `Quiz ${quizNumber}, question ${quizQuestion}`,
    prompt,
    options: finalOptions.map((option) => inlineMarkdown(stripOptionPrefix(option))),
    ...answerFields,
    explanation: inlineMarkdown(answerLine),
    images,
  };
}

function parsePracticeQuestions(file) {
  const markdown = fs.readFileSync(file, "utf8");
  const moduleMatch = path.basename(path.dirname(file)).match(/^Module (\d+)/);
  const moduleNumber = Number(moduleMatch?.[1]);
  const answers = parseAnswerLines(markdown);
  const questions = [];
  let section = "";
  let current = null;

  function finishQuestion() {
    if (!current) return;
    const id = `practice-m${moduleNumber}-q${current.number}`;
    const options = current.kind === "true-false" ? ["True", "False"] : current.options;
    const answerLine = answers.get(current.number) ?? "";
    const answerFields = questionAnswerFields(answersFromOptions(options, answerLine));
    questions.push({
      id,
      module: moduleNumber,
      quiz: null,
      quizQuestion: current.number,
      sourceType: "practice",
      sourceLabel: `Practice bank, question ${current.number}`,
      prompt: current.promptLines.map(inlineMarkdown).join("<br>"),
      options: options.map((option) => inlineMarkdown(stripOptionPrefix(option))),
      ...answerFields,
      explanation: inlineMarkdown(answerLine),
      images: practiceImages(id),
    });
    current = null;
  }

  for (const line of markdown.split("\n")) {
    if (line.startsWith("<details>")) break;
    const heading = line.match(/^#{2,3}\s+(.+)/);
    if (heading) {
      finishQuestion();
      section = heading[1].trim();
      continue;
    }

    const question = line.match(/^(\d+)\.\s+(.+)/);
    if (question && (section === "Multiple Choice" || section === "True or False")) {
      finishQuestion();
      current = {
        number: Number(question[1]),
        kind: section === "True or False" ? "true-false" : "multiple-choice",
        promptLines: [question[2].trim()],
        options: [],
      };
      continue;
    }

    if (!current) continue;
    const option = line.match(/^\s+-\s+(.+)/);
    if (option) current.options.push(option[1].trim());
    else if (line.trim()) current.promptLines.push(line.trim());
  }
  finishQuestion();
  return questions;
}

function parseQuizBank(file) {
  const markdown = fs.readFileSync(file, "utf8");
  const moduleMatch = path.basename(path.dirname(file)).match(/^Module (\d+)/);
  const moduleNumber = Number(moduleMatch?.[1]);
  const official = markdown.match(/^#{2,3} Official Course Quiz Questions\s*$([\s\S]*?)^<details>/m);
  if (!official) return [];
  const answers = parseAnswerLines(markdown);
  const blocks = official[1]
    .split(/(?=^\d+\.\s+\*\*Saved quiz-\d+, Question \d+\.\*\*)/m)
    .filter((block) => /^\d+\.\s+\*\*Saved quiz-/.test(block));
  return blocks.map((block) => parseQuestionBlock(block.trim(), file, moduleNumber, answers)).filter(Boolean);
}

fs.mkdirSync(ASSET_DIR, { recursive: true });
const questions = findQuizBanks()
  .flatMap((file) => [...parsePracticeQuestions(file), ...parseQuizBank(file)])
  .sort((a, b) => a.module - b.module || a.sourceType.localeCompare(b.sourceType) || a.quizQuestion - b.quizQuestion);
const unresolved = questions.filter(
  (question) =>
    question.options.length < 2 ||
    !question.answers.length ||
    question.answers.some((answer) => answer < 0 || answer >= question.options.length),
);
const invalid = questions.filter(
  (question) =>
    /©|iStock|Getty Images|Course Author\(s\)/i.test(plainText(question.prompt)) ||
    question.options.some((option) => /^(?:[A-Za-z]|\d+)[.)]\s+/.test(plainText(option))) ||
    question.images.some((imagePath) => !fs.existsSync(path.join(SITE_DIR, imagePath))),
);

if (unresolved.length || invalid.length) {
  console.error("Unresolved questions:");
  for (const question of unresolved) {
    console.error(`${question.id}: options=${question.options.length}, answers=${question.answers.join(",")}, ${plainText(question.explanation)}`);
  }
  for (const question of invalid) {
    console.error(`${question.id}: failed formatting or image validation`);
  }
  process.exitCode = 1;
} else {
  const output = `window.QUIZ_QUESTIONS = ${JSON.stringify(questions, null, 2)};\n`;
  fs.writeFileSync(path.join(SITE_DIR, "questions.js"), output);
  const practiceCount = questions.filter((question) => question.sourceType === "practice").length;
  const officialCount = questions.filter((question) => question.sourceType === "official").length;
  console.log(
    `Wrote ${questions.length} questions (${officialCount} official, ${practiceCount} practice; ${questions.filter((question) => question.selectionMode === "multiple").length} multi-select) with ${questions.reduce((sum, q) => sum + q.images.length, 0)} image placements.`,
  );
}
