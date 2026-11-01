import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import { DIFFICULTY } from './scoringService.js';
import { validateGeneratedCase } from './validationService.js';

const schema = {
  type: 'OBJECT',
  properties: {
    title: { type: 'STRING' },
    story: { type: 'STRING' },
    suspects: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          suspectId: { type: 'STRING' },
          name: { type: 'STRING' },
          occupation: { type: 'STRING' },
          description: { type: 'STRING' },
          motive: { type: 'STRING' },
          alibi: { type: 'STRING' }
        },
        required: ['suspectId', 'name', 'occupation', 'description', 'motive', 'alibi']
      }
    },
    clues: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          clueId: { type: 'STRING' },
          title: { type: 'STRING' },
          description: { type: 'STRING' },
          category: { type: 'STRING' }
        },
        required: ['clueId', 'title', 'description', 'category']
      }
    },
    hints: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          hintId: { type: 'STRING' },
          text: { type: 'STRING' }
        },
        required: ['hintId', 'text']
      }
    },
    solution: {
      type: 'OBJECT',
      properties: {
        culpritId: { type: 'STRING' },
        explanation: { type: 'STRING' },
        evidenceIds: { type: 'ARRAY', items: { type: 'STRING' } }
      },
      required: ['culpritId', 'explanation', 'evidenceIds']
    }
  },
  required: ['title', 'story', 'suspects', 'clues', 'hints', 'solution']
};

export async function generateMystery(premise, difficulty, language) {
  if (!process.env.GEMINI_API_KEY) {
    throw Object.assign(new Error('The AI service is not configured.'), { status: 503, code: 'AI_UNAVAILABLE' });
  }

  const c = DIFFICULTY[difficulty];
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const languageInstruction = language === 'hi'
    ? 'Write player-visible descriptive text (title, story, suspect name/occupation/description/motive/alibi, clue title/description/category, hint text, solution explanation) in natural Hindi using Devanagari script.'
    : 'Write every player-visible field in clear English.';

  const prompt = `You are an expert detective mystery game designer. Return an original, logically consistent, concise mystery. ${languageInstruction} Difficulty: ${difficulty}. Premise: ${premise || 'Create a compelling original premise.'}. Generate exactly ${c.suspects} suspects, ${c.clues} clues, and ${c.hints} progressive hints. One suspect must be the definite culprit. Clues collectively establish them; do not reveal the culprit in story, descriptions, motives, alibis, or hints. IMPORTANT: All identifiers MUST strictly remain in English alphanumeric format: suspect_01 to suspect_0${c.suspects}, clue_01 to clue_0${c.clues}, and hint_01 to hint_0${c.hints}. In solution.culpritId, you MUST strictly use the exact suspectId (e.g. "suspect_01"), NEVER the suspect name. In solution.evidenceIds, you MUST strictly cite valid clueId strings (e.g. ["clue_01", "clue_02"]), NEVER clue titles. Keep the title under 8 words, the story under 130 words, every suspect field and clue description under 24 words, each hint under 18 words, and the solution under 110 words. Never use markdown.`;

  let lastError;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const response = await ai.models.generateContent({
        model: process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: schema,
          thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL },
          maxOutputTokens: 4096
        }
      });
      return validateGeneratedCase(JSON.parse(response.text), difficulty);
    } catch (error) {
      lastError = error;
    }
  }

  const isQuota = lastError?.status === 429 || lastError?.message?.includes('RESOURCE_EXHAUSTED') || lastError?.message?.includes('quota');
  const status = isQuota ? 429 : 503;
  const message = isQuota
    ? 'AI service rate limit exceeded. Please wait a moment and try again.'
    : 'Unable to generate a valid mystery. Please try again.';

  throw Object.assign(new Error(message), { status, code: isQuota ? 'RATE_LIMITED' : 'GENERATION_FAILED', cause: lastError });
}
