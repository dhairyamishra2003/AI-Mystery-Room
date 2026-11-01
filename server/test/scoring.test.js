import test from 'node:test';
import assert from 'node:assert/strict';
import { scoreCase } from '../src/services/scoringService.js';

test('scores the specification examples', () => {
  assert.equal(scoreCase('easy', 5, 0, true).finalScore, 125);
  assert.equal(scoreCase('medium', 7, 3, true).finalScore, 155);
  assert.equal(scoreCase('hard', 9, 3, true).finalScore, 215);
  assert.equal(scoreCase('easy', 0, 2, true).finalScore, 80);
  assert.equal(scoreCase('medium', 7, 0, false).finalScore, 0);
  assert.equal(scoreCase('hard', 0, 3, true).finalScore, 170);
});
