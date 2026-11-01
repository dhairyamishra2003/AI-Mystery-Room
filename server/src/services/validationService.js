import { z } from 'zod';
import { DIFFICULTY } from './scoringService.js';

export const CATEGORY_DEFINITIONS = {
  conversations: {
    en: 'Conversations',
    hi: 'बातचीत',
    desc: 'Dialogue records and suspicious conversations.'
  },
  photographs: {
    en: 'Photographs',
    hi: 'तस्वीरें',
    desc: 'Images, photographs and visual evidence.'
  },
  cctv_simulations: {
    en: 'CCTV Simulations',
    hi: 'सीसीटीवी फुटेज',
    desc: 'Simulated surveillance footage and recordings.'
  },
  witness_accounts: {
    en: 'Witness Accounts',
    hi: 'गवाहों के बयान',
    desc: 'Statements and testimonies from witnesses.'
  },
  physical_evidence: {
    en: 'Physical Evidence',
    hi: 'भौतिक साक्ष्य',
    desc: 'Fingerprints, objects, documents and forensic evidence.'
  },
  timeline_records: {
    en: 'Timeline Records',
    hi: 'समयरेखा रिकॉर्ड',
    desc: 'Events, timestamps and activity records.'
  }
};

const required = z.string().trim().min(1);
const generatedSchema = z.object({
  title: required,
  story: required,
  suspects: z.array(z.object({
    suspectId: required,
    name: required,
    occupation: required,
    description: required,
    motive: required,
    alibi: required
  })),
  clues: z.array(z.object({
    clueId: required,
    title: required,
    description: required,
    category: required
  })),
  hints: z.array(z.object({
    hintId: required,
    text: required
  })),
  solution: z.object({
    culpritId: required,
    explanation: required,
    evidenceIds: z.array(required).min(1)
  })
});

const unique = (values) => new Set(values).size === values.length;

export function validateGeneratedCase(payload, difficulty, allowedCategoryIds = null, language = 'en') {
  const data = generatedSchema.parse(payload);
  const config = DIFFICULTY[difficulty];

  if (data.suspects.length !== config.suspects || data.clues.length !== config.clues || data.hints.length !== config.hints) {
    throw new Error('AI response did not follow difficulty counts');
  }
  if (!unique(data.suspects.map(x => x.suspectId)) || !unique(data.clues.map(x => x.clueId)) || !unique(data.hints.map(x => x.hintId))) {
    throw new Error('AI response contains duplicate IDs');
  }

  // Normalize culpritId if the model supplied the suspect name or matching trimmed name
  const exactCulprit = data.suspects.find(x => x.suspectId === data.solution.culpritId);
  if (!exactCulprit) {
    const matchedByName = data.suspects.find(x => x.name.trim().toLowerCase() === data.solution.culpritId.trim().toLowerCase());
    if (matchedByName) {
      data.solution.culpritId = matchedByName.suspectId;
    } else {
      throw new Error('Culprit is not a suspect');
    }
  }

  // Normalize evidenceIds if the model cited clue titles instead of IDs
  data.solution.evidenceIds = data.solution.evidenceIds.map(id => {
    if (data.clues.some(x => x.clueId === id)) return id;
    const matchedByTitle = data.clues.find(x => x.title.trim().toLowerCase() === id.trim().toLowerCase());
    return matchedByTitle ? matchedByTitle.clueId : id;
  });

  if (!data.solution.evidenceIds.every(id => data.clues.some(x => x.clueId === id))) {
    throw new Error('Solution references missing evidence');
  }

  // Normalize clue categories to respect selected evidence categories
  if (Array.isArray(allowedCategoryIds) && allowedCategoryIds.length > 0) {
    data.clues.forEach((clue, idx) => {
      const rawCat = (clue.category || '').toLowerCase();
      const matchedId = allowedCategoryIds.find(id => {
        const def = CATEGORY_DEFINITIONS[id];
        return id === rawCat ||
          def?.en.toLowerCase() === rawCat ||
          rawCat.includes(id) ||
          (def && rawCat.includes(def.en.toLowerCase())) ||
          (def && rawCat.includes(def.hi));
      });

      if (matchedId) {
        clue.category = language === 'hi'
          ? (CATEGORY_DEFINITIONS[matchedId]?.hi || CATEGORY_DEFINITIONS[matchedId]?.en || matchedId)
          : (CATEGORY_DEFINITIONS[matchedId]?.en || matchedId);
      } else {
        const fallbackId = allowedCategoryIds[idx % allowedCategoryIds.length];
        clue.category = language === 'hi'
          ? (CATEGORY_DEFINITIONS[fallbackId]?.hi || CATEGORY_DEFINITIONS[fallbackId]?.en || fallbackId)
          : (CATEGORY_DEFINITIONS[fallbackId]?.en || fallbackId);
      }
    });
  }

  return data;
}
