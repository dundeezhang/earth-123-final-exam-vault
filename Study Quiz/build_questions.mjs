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
    answer: 0,
  },
  "quiz-7-q3": {
    options: [
      "B = Precipitation; E = Groundwater out; C = Evaporation; D = Surface water out; A = Groundwater in",
      "B = Evaporation; E = Groundwater in; C = Precipitation; D = Groundwater out; A = Surface water out",
      "B = Surface water out; E = Evaporation; C = Groundwater in; D = Precipitation; A = Groundwater out",
      "B = Groundwater in; E = Surface water out; C = Groundwater out; D = Evaporation; A = Precipitation",
    ],
    answer: 0,
  },
  "quiz-7-q6": {
    options: ["20,009 m³/day", "19,991 m³/day", "20,900 m³/day", "4,009 m³/day"],
    answer: 0,
  },
  "quiz-7-q7": {
    options: ["60,008 m³/day", "59,992 m³/day", "12,008 m³/day", "60,800 m³/day"],
    answer: 0,
  },
  "quiz-7-q8": {
    options: ["16 mm", "8 mm", "31 mm", "155 mm"],
    answer: 0,
  },
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
  result = result.replace(/\\Delta/g, "Δ").replace(/\\sum/g, "Σ");
  result = result.replace(/\\_/g, "_").replace(/\\%/g, "%");
  result = result.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  result = result.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  return result;
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

function answerFromOptions(options, answerLine) {
  const leadMatch = answerLine?.match(/^\*\*([^*]+)\*\*/);
  const lead = plainText(leadMatch?.[1] ?? answerLine ?? "");
  const normalizedOptions = options.map((option) => plainText(option).toLowerCase());

  if (/^(true|false)\b/i.test(lead)) {
    return normalizedOptions.findIndex((option) => option === lead.match(/^(true|false)/i)[1].toLowerCase());
  }

  const optionsUseLetters = normalizedOptions.every((option) => /^[a-z]\)/i.test(option));
  const letterMatch = lead.match(/^([a-z])(?:\)|\.|,|\s)/i);
  if (optionsUseLetters && letterMatch) {
    const label = `${letterMatch[1].toLowerCase()})`;
    return normalizedOptions.findIndex((option) => option.startsWith(label));
  }

  const cleanedLead = lead.replace(/^[a-z]\)\s*/i, "").replace(/[.,]$/, "").toLowerCase();
  return normalizedOptions.findIndex((option) => {
    const cleanedOption = option.replace(/^[a-z0-9]+[.)]\s*/i, "").replace(/[.,]$/, "");
    return cleanedOption === cleanedLead || cleanedLead.startsWith(cleanedOption);
  });
}

function copyQuestionImage(sourceFile, markdownPath, questionId) {
  const source = path.resolve(path.dirname(sourceFile), decodeURIComponent(markdownPath));
  if (!fs.existsSync(source)) throw new Error(`Missing image: ${source}`);
  fs.mkdirSync(ASSET_DIR, { recursive: true });
  const outputName = `${questionId}-${path.basename(source).replace(/[^a-zA-Z0-9._-]+/g, "-")}`;
  const output = path.join(ASSET_DIR, outputName);
  fs.copyFileSync(source, output);
  return `assets/${outputName}`;
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
  const promptLines = match[4] ? [match[4]] : [];
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
    if (line.trim()) promptLines.push(line.trim());
  }

  const manual = MANUAL[id];
  const finalOptions = manual?.options ?? options;
  const answerLine = answers.get(bankNumber) ?? "";
  const answer = manual?.answer ?? answerFromOptions(finalOptions, answerLine);
  const prompt = promptLines
    .filter((line) => !/^\*[^*].*\*$/.test(line))
    .map(inlineMarkdown)
    .join("<br>");

  return {
    id,
    module: moduleNumber,
    quiz: quizNumber,
    quizQuestion,
    prompt,
    options: finalOptions.map(inlineMarkdown),
    answer,
    explanation: inlineMarkdown(answerLine),
    images,
  };
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
const questions = findQuizBanks().flatMap(parseQuizBank).sort((a, b) => a.quiz - b.quiz || a.quizQuestion - b.quizQuestion);
const unresolved = questions.filter((question) => question.answer < 0 || question.options.length < 2);

if (unresolved.length) {
  console.error("Unresolved questions:");
  for (const question of unresolved) {
    console.error(`${question.id}: options=${question.options.length}, answer=${question.answer}, ${plainText(question.explanation)}`);
  }
  process.exitCode = 1;
} else {
  const output = `window.QUIZ_QUESTIONS = ${JSON.stringify(questions, null, 2)};\n`;
  fs.writeFileSync(path.join(SITE_DIR, "questions.js"), output);
  console.log(`Wrote ${questions.length} questions with ${questions.reduce((sum, q) => sum + q.images.length, 0)} image placements.`);
}
