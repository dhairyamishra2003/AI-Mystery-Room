import { z } from 'zod';
import { DIFFICULTY } from './scoringService.js';

const required = z.string().trim().min(1);
const generatedSchema = z.object({
  title: required, story: required,
  suspects: z.array(z.object({ suspectId: required, name: required, occupation: required, description: required, motive: required, alibi: required })),
  clues: z.array(z.object({ clueId: required, title: required, description: required, category: required })),
  hints: z.array(z.object({ hintId: required, text: required })),
  solution: z.object({ culpritId: required, explanation: required, evidenceIds: z.array(required).min(1) })
});
const unique = (values) => new Set(values).size === values.length;
export function validateGeneratedCase(payload, difficulty) {
  const data = generatedSchema.parse(payload); const config = DIFFICULTY[difficulty];
  if (data.suspects.length !== config.suspects || data.clues.length !== config.clues || data.hints.length !== config.hints) throw new Error('AI response did not follow difficulty counts');
  if (!unique(data.suspects.map(x => x.suspectId)) || !unique(data.clues.map(x => x.clueId)) || !unique(data.hints.map(x => x.hintId))) throw new Error('AI response contains duplicate IDs');
  if (!data.suspects.some(x => x.suspectId === data.solution.culpritId)) throw new Error('Culprit is not a suspect');
  if (!data.solution.evidenceIds.every(id => data.clues.some(x => x.clueId === id))) throw new Error('Solution references missing evidence');
  return data;
}
