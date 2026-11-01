export const DIFFICULTY = { easy: { suspects: 3, clues: 5, hints: 2, base: 100 }, medium: { suspects: 4, clues: 7, hints: 3, base: 150 }, hard: { suspects: 5, clues: 9, hints: 3, base: 200 } };
export function scoreCase(difficulty, clueCount, hintCount, correct) {
  const basePoints = DIFFICULTY[difficulty].base;
  const cluePoints = clueCount * 5;
  const hintPenalty = hintCount * 10;
  return { basePoints, cluePoints, hintPenalty, finalScore: correct ? Math.max(0, basePoints + cluePoints - hintPenalty) : 0 };
}
