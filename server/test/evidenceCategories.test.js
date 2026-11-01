import test from 'node:test';
import assert from 'node:assert/strict';
import { validateGeneratedCase, CATEGORY_DEFINITIONS } from '../src/services/validationService.js';

test('validates case with full evidence categories', () => {
  const mockPayload = {
    title: 'The Stolen Diamond',
    story: 'A priceless gem disappeared during a black-tie gala.',
    suspects: [
      { suspectId: 'suspect_01', name: 'John Doe', occupation: 'Butler', description: 'Quiet man', motive: 'Greed', alibi: 'In the pantry' },
      { suspectId: 'suspect_02', name: 'Jane Smith', occupation: 'Guest', description: 'Socialite', motive: 'Debt', alibi: 'On the terrace' },
      { suspectId: 'suspect_03', name: 'Bob Ray', occupation: 'Driver', description: 'Shifty look', motive: 'Revenge', alibi: 'In the driveway' }
    ],
    clues: [
      { clueId: 'clue_01', title: 'Whispered conversation', description: 'Overheard arguing', category: 'Conversations' },
      { clueId: 'clue_02', title: 'CCTV footage of hall', description: 'Shadowy figure moving', category: 'CCTV Simulations' },
      { clueId: 'clue_03', title: 'Broken cufflink', description: 'Found by vault', category: 'Physical Evidence' },
      { clueId: 'clue_04', title: 'Butler logbook', description: 'Entry stamped at 10 PM', category: 'Timeline Records' },
      { clueId: 'clue_05', title: 'Guest photograph', description: 'Photograph on terrace', category: 'Photographs' }
    ],
    hints: [
      { hintId: 'hint_01', text: 'Examine the vault floor.' },
      { hintId: 'hint_02', text: 'Check the alibis closely.' }
    ],
    solution: {
      culpritId: 'suspect_01',
      explanation: 'The butler had access to the pantry and dropped his cufflink.',
      evidenceIds: ['clue_03', 'clue_04']
    }
  };

  const validated = validateGeneratedCase(mockPayload, 'easy', ['conversations', 'cctv_simulations', 'physical_evidence', 'timeline_records', 'photographs']);
  assert.equal(validated.clues.length, 5);
  assert.equal(validated.solution.culpritId, 'suspect_01');
  assert.equal(validated.clues[0].category, 'Conversations');
  assert.equal(validated.clues[1].category, 'CCTV Simulations');
  assert.equal(validated.clues[2].category, 'Physical Evidence');
});

test('normalizes clue categories to strictly selected categories', () => {
  const mockPayload = {
    title: 'The Stolen Diamond',
    story: 'A priceless gem disappeared.',
    suspects: [
      { suspectId: 'suspect_01', name: 'John Doe', occupation: 'Butler', description: 'Quiet man', motive: 'Greed', alibi: 'In the pantry' },
      { suspectId: 'suspect_02', name: 'Jane Smith', occupation: 'Guest', description: 'Socialite', motive: 'Debt', alibi: 'On the terrace' },
      { suspectId: 'suspect_03', name: 'Bob Ray', occupation: 'Driver', description: 'Shifty look', motive: 'Revenge', alibi: 'In the driveway' }
    ],
    clues: [
      { clueId: 'clue_01', title: 'Security camera clip', description: 'Video recording', category: 'cctv' },
      { clueId: 'clue_02', title: 'Camera snapshot', description: 'Polaroid picture', category: 'photograph' },
      { clueId: 'clue_03', title: 'Hallway surveillance', description: 'Digital tape', category: 'CCTV footage' },
      { clueId: 'clue_04', title: 'Party photo', description: 'Image from room', category: 'Photographs' },
      { clueId: 'clue_05', title: 'Audio tape', description: 'Voice memo', category: 'Unexpected' }
    ],
    hints: [
      { hintId: 'hint_01', text: 'Check the cameras.' },
      { hintId: 'hint_02', text: 'Compare photo timestamps.' }
    ],
    solution: {
      culpritId: 'suspect_02',
      explanation: 'Jane was captured on CCTV despite claiming to be elsewhere.',
      evidenceIds: ['clue_01', 'clue_04']
    }
  };

  // Only photographs and cctv_simulations are allowed
  const allowed = ['photographs', 'cctv_simulations'];
  const validated = validateGeneratedCase(mockPayload, 'easy', allowed, 'en');
  
  // Verify that all 5 clues have categories strictly from the allowed set
  const allowedCategoryNames = ['Photographs', 'CCTV Simulations'];
  for (const clue of validated.clues) {
    assert.ok(allowedCategoryNames.includes(clue.category), `Category ${clue.category} is not in allowed list`);
  }
});

test('handles Hindi category normalization correctly', () => {
  const mockPayload = {
    title: 'चोरी का रहस्य',
    story: 'एक दुर्लभ हार गायब हो गया।',
    suspects: [
      { suspectId: 'suspect_01', name: 'रमेश', occupation: 'रसोइया', description: 'शांत व्यक्ति', motive: 'लालच', alibi: 'रसोई में' },
      { suspectId: 'suspect_02', name: 'सुरेश', occupation: 'ड्राइवर', description: 'पुराना कर्मचारी', motive: 'कर्ज', alibi: 'कार में' },
      { suspectId: 'suspect_03', name: 'महेश', occupation: 'माली', description: 'नया कर्मचारी', motive: 'बदला', alibi: 'बगीचे में' }
    ],
    clues: [
      { clueId: 'clue_01', title: 'सीसीटीवी रिकॉर्डिंग', description: 'गलियारे का फुटेज', category: 'cctv' },
      { clueId: 'clue_02', title: 'संदिग्ध तस्वीर', description: 'कैमरे की फोटो', category: 'photo' },
      { clueId: 'clue_03', title: 'गुप्त बातचीत', description: 'फोन कॉल', category: 'conversation' },
      { clueId: 'clue_04', title: 'गवाह का बयान', description: 'पड़ोसी की गवाही', category: 'witness' },
      { clueId: 'clue_05', title: 'टूटी हुई चाबी', description: 'दरवाजे के पास मिली', category: 'physical' }
    ],
    hints: [
      { hintId: 'hint_01', text: 'फुटेज ध्यान से देखें।' },
      { hintId: 'hint_02', text: 'चाबी किसकी है?' }
    ],
    solution: {
      culpritId: 'suspect_01',
      explanation: 'रमेश ने रात में ताला खोला था।',
      evidenceIds: ['clue_01', 'clue_05']
    }
  };

  const allowed = ['conversations', 'photographs', 'cctv_simulations', 'witness_accounts', 'physical_evidence'];
  const validated = validateGeneratedCase(mockPayload, 'easy', allowed, 'hi');
  assert.equal(validated.clues.length, 5);
  assert.ok(validated.clues[0].category.length > 0);
});

