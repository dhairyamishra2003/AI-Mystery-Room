import test from 'node:test';
import assert from 'node:assert/strict';
import { countWords } from '../src/controllers/caseController.js';
import { z } from 'zod';
import { CATEGORY_DEFINITIONS } from '../src/services/validationService.js';

const DEFAULT_CATEGORIES = Object.keys(CATEGORY_DEFINITIONS);

const testSchema = z.object({
  premise: z.string()
    .default('')
    .refine(val => countWords(val) <= 2000, {
      message: 'Case description cannot exceed 2,000 words.'
    }),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  language: z.enum(['en', 'hi']).default('en'),
  evidenceCategories: z.array(z.string()).min(1, 'Select at least one evidence category to open a case.').default(DEFAULT_CATEGORIES)
});

function generateWords(count, lang = 'en') {
  if (lang === 'hi') {
    const sampleWords = ['रहस्यमय', 'घटना', 'जांच', 'सबूत', 'गवाह', 'चोरी', 'स्थान', 'पुलिस', 'संदिग्ध', 'आरोपी'];
    return Array.from({ length: count }, (_, i) => sampleWords[i % sampleWords.length]).join(' ');
  }
  return Array.from({ length: count }, (_, i) => `word${i + 1}`).join(' ');
}

test('countWords accurately counts English and Hindi text', () => {
  assert.equal(countWords(''), 0);
  assert.equal(countWords('   '), 0);
  assert.equal(countWords('one two three'), 3);
  assert.equal(countWords('  hello   world  test  '), 3);
  assert.equal(countWords('एक दुर्लभ वायलिन संगीत कार्यक्रम से पहले गायब हो जाता है'), 11);
});

test('accepts case description of exactly 500 words', () => {
  const text500 = generateWords(500);
  assert.equal(countWords(text500), 500);
  const parsed = testSchema.parse({ premise: text500, difficulty: 'medium' });
  assert.equal(countWords(parsed.premise), 500);
});

test('accepts case description of exactly 1,000 words', () => {
  const text1000 = generateWords(1000);
  assert.equal(countWords(text1000), 1000);
  const parsed = testSchema.parse({ premise: text1000, difficulty: 'hard' });
  assert.equal(countWords(parsed.premise), 1000);
});

test('accepts case description of exactly 1,500 words', () => {
  const text1500 = generateWords(1500);
  assert.equal(countWords(text1500), 1500);
  const parsed = testSchema.parse({ premise: text1500, difficulty: 'easy' });
  assert.equal(countWords(parsed.premise), 1500);
});

test('accepts case description of exactly 2,000 words in English and Hindi', () => {
  const text2000En = generateWords(2000, 'en');
  assert.equal(countWords(text2000En), 2000);
  const parsedEn = testSchema.parse({ premise: text2000En, difficulty: 'hard', language: 'en' });
  assert.equal(countWords(parsedEn.premise), 2000);

  const text2000Hi = generateWords(2000, 'hi');
  assert.equal(countWords(text2000Hi), 2000);
  const parsedHi = testSchema.parse({ premise: text2000Hi, difficulty: 'hard', language: 'hi' });
  assert.equal(countWords(parsedHi.premise), 2000);
});

test('rejects case description exceeding 2,000 words with clear error message', () => {
  const text2001 = generateWords(2001);
  assert.equal(countWords(text2001), 2001);

  assert.throws(
    () => testSchema.parse({ premise: text2001, difficulty: 'easy' }),
    (err) => {
      assert.ok(err.errors[0].message.includes('Case description cannot exceed 2,000 words.'));
      return true;
    }
  );
});
