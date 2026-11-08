import crypto from 'node:crypto';
import { z } from 'zod';
import { Case } from '../models/Case.js';
import { generateMystery } from '../services/geminiService.js';
import { DIFFICULTY, scoreCase } from '../services/scoringService.js';
import { CATEGORY_DEFINITIONS } from '../services/validationService.js';

export function countWords(text) {
  if (!text || typeof text !== 'string') return 0;
  const matches = text.trim().match(/\S+/g);
  return matches ? matches.length : 0;
}

const DEFAULT_CATEGORIES = Object.keys(CATEGORY_DEFINITIONS);

const createSchema = z.object({
  premise: z.string()
    .default('')
    .refine(val => countWords(val) <= 2000, {
      message: 'Case description cannot exceed 2,000 words.'
    }),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  language: z.enum(['en', 'hi']).default('en'),
  evidenceCategories: z.array(z.string()).min(1, 'Select at least one evidence category to open a case.').default(DEFAULT_CATEGORIES)
});

const accuseSchema = z.object({
  suspectId: z.string().trim().min(1)
});

const publicCase = (c) => ({
  caseId: c.id,
  title: c.title,
  story: c.story,
  difficulty: c.difficulty,
  language: c.language,
  evidenceCategories: c.evidenceCategories || [],
  suspects: c.suspects,
  clues: c.clues.map(x => c.progress.discoveredClueIds.includes(x.clueId)
    ? x
    : { clueId: x.clueId, title: x.title, category: x.category, discovered: false }
  ),
  progress: c.progress,
  remainingHints: c.hints.length - c.progress.usedHintIds.length
});

export async function createCase(req, res) {
  const { premise, difficulty, language, evidenceCategories } = createSchema.parse(req.body);
  const normalizedCategories = [...new Set(evidenceCategories.map(cat => {
    const raw = String(cat).trim().toLowerCase();
    if (DEFAULT_CATEGORIES.includes(raw)) return raw;
    const found = DEFAULT_CATEGORIES.find(id =>
      CATEGORY_DEFINITIONS[id].en.toLowerCase() === raw ||
      raw.includes(id) ||
      raw.includes(CATEGORY_DEFINITIONS[id].en.toLowerCase())
    );
    return found || raw;
  }))].filter(Boolean);

  if (normalizedCategories.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Select at least one evidence category to open a case.',
      errorCode: 'VALIDATION_ERROR'
    });
  }

  const generated = await generateMystery(premise.trim(), difficulty, language, normalizedCategories);
  const token = crypto.randomBytes(32).toString('hex');
  const accessTokenHash = crypto.createHash('sha256').update(token).digest('hex');
  const caseFile = await Case.create({
    ...generated,
    premise: premise.trim(),
    difficulty,
    language,
    evidenceCategories: normalizedCategories,
    accessTokenHash
  });

  res.status(201).json({
    success: true,
    data: { ...publicCase(caseFile), accessToken: token }
  });
}

export async function getCase(req, res) {
  res.json({ success: true, data: publicCase(req.caseFile) });
}

export async function discoverClue(req, res) {
  const c = req.caseFile;
  if (c.progress.status !== 'active') {
    return res.status(409).json({ success: false, message: 'This case is completed.', errorCode: 'CASE_COMPLETED' });
  }
  const clue = c.clues.find(x => x.clueId === req.params.clueId);
  if (!clue) {
    return res.status(404).json({ success: false, message: 'The requested clue was not found.', errorCode: 'CLUE_NOT_FOUND' });
  }
  if (c.progress.discoveredClueIds.includes(clue.clueId)) {
    return res.status(409).json({ success: false, message: 'That clue has already been discovered.', errorCode: 'CLUE_ALREADY_DISCOVERED' });
  }
  c.progress.discoveredClueIds.push(clue.clueId);
  await c.save();
  res.json({
    success: true,
    data: {
      ...clue.toObject(),
      discovered: true,
      discoveredClues: c.progress.discoveredClueIds.length,
      pointsEarned: 5
    }
  });
}

export async function requestHint(req, res) {
  const c = req.caseFile;
  if (c.progress.status !== 'active') {
    return res.status(409).json({ success: false, message: 'This case is completed.', errorCode: 'CASE_COMPLETED' });
  }
  const hint = c.hints.find(x => !c.progress.usedHintIds.includes(x.hintId));
  if (!hint) {
    return res.status(409).json({ success: false, message: 'No hints remain.', errorCode: 'HINTS_EXHAUSTED' });
  }
  c.progress.usedHintIds.push(hint.hintId);
  await c.save();
  res.json({
    success: true,
    data: {
      hint: hint.text,
      hintsUsed: c.progress.usedHintIds.length,
      remainingHints: c.hints.length - c.progress.usedHintIds.length,
      pointsDeducted: 10
    }
  });
}

export async function accuse(req, res) {
  const { suspectId } = accuseSchema.parse(req.body);
  const c = req.caseFile;
  if (c.progress.status !== 'active') {
    return res.status(409).json({ success: false, message: 'An accusation has already been submitted.', errorCode: 'CASE_COMPLETED' });
  }
  if (!c.suspects.some(x => x.suspectId === suspectId)) {
    return res.status(400).json({ success: false, message: 'Invalid suspect.', errorCode: 'SUSPECT_NOT_FOUND' });
  }
  const correct = suspectId === c.solution.culpritId;
  const score = scoreCase(c.difficulty, c.progress.discoveredClueIds.length, c.progress.usedHintIds.length, correct);
  c.accusation = { suspectId, correct, submittedAt: new Date() };
  c.score = score;
  c.progress.status = 'completed';
  c.completedAt = new Date();
  await c.save();
  res.json({ success: true, data: { verdict: correct ? 'correct' : 'incorrect', score } });
}

export async function getResult(req, res) {
  const c = req.caseFile;
  if (c.progress.status !== 'completed') {
    return res.status(409).json({ success: false, message: 'Complete the case before viewing its result.', errorCode: 'CASE_ACTIVE' });
  }
  const culprit = c.suspects.find(x => x.suspectId === c.solution.culpritId);
  const supportingEvidence = c.clues.filter(x => c.solution.evidenceIds.includes(x.clueId));
  res.json({
    success: true,
    data: {
      verdict: c.accusation.correct ? 'correct' : 'incorrect',
      culprit,
      explanation: c.solution.explanation,
      supportingEvidence,
      score: c.score,
      statistics: {
        discoveredClues: c.progress.discoveredClueIds.length,
        totalClues: c.clues.length,
        hintsUsed: c.progress.usedHintIds.length
      }
    }
  });
}
