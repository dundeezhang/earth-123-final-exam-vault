# EARTH 123 Study Quiz

A static review app built from 114 locally saved EARTH 123 quiz questions and 230 generated multiple-choice or true/false practice questions.

## Use

Open [`index.html`](index.html) in a browser. Questions appear in a new random order for each session. Select one or more modules to limit the question pool.

The next question remains locked until the current answer is correct. Progress is saved in the browser. The exam mark records each question's first checked answer. Retries change the attempt count but cannot recover an exam mark.

Every incorrect check is also saved in a persistent missed-question log. The log tracks repeated misses and chosen answers, supports a focused missed-question session, and exports an Obsidian-ready Markdown file for improving the exam cheat sheet. Resetting a quiz session does not clear this log.

## Source Notes

- Questions and answers come from the vault's official and generated quiz-bank sections.
- Original saved quiz figures and relevant practice-bank course figures are included where they were recoverable.
- The exact saved figure for Quiz 4, Question 2 was unavailable locally. The closest related course drainage-basin figure is used.
- No web material is used.

## Rebuild Question Data

Run `node build_questions.mjs` from this folder after updating the quiz banks.
