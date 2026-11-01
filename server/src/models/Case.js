import mongoose from 'mongoose';

const suspectSchema = new mongoose.Schema({ suspectId: { type: String, required: true }, name: { type: String, required: true }, occupation: { type: String, required: true }, description: { type: String, required: true }, motive: { type: String, required: true }, alibi: { type: String, required: true } }, { _id: false });
const clueSchema = new mongoose.Schema({ clueId: { type: String, required: true }, title: { type: String, required: true }, description: { type: String, required: true }, category: { type: String, required: true } }, { _id: false });
const hintSchema = new mongoose.Schema({ hintId: { type: String, required: true }, text: { type: String, required: true } }, { _id: false });

const caseSchema = new mongoose.Schema({
  title: { type: String, required: true }, premise: { type: String, default: '' }, story: { type: String, required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true, index: true },
  language: { type: String, enum: ['en', 'hi'], required: true, default: 'en' },
  suspects: { type: [suspectSchema], required: true }, clues: { type: [clueSchema], required: true }, hints: { type: [hintSchema], required: true },
  solution: { culpritId: { type: String, required: true }, explanation: { type: String, required: true }, evidenceIds: { type: [String], required: true } },
  progress: { discoveredClueIds: { type: [String], default: [] }, usedHintIds: { type: [String], default: [] }, status: { type: String, enum: ['active', 'completed'], default: 'active', index: true } },
  accusation: { suspectId: String, correct: Boolean, submittedAt: Date },
  score: { basePoints: { type: Number, default: 0 }, cluePoints: { type: Number, default: 0 }, hintPenalty: { type: Number, default: 0 }, finalScore: { type: Number, default: 0 } },
  accessTokenHash: { type: String, required: true, select: false }, completedAt: Date
}, { timestamps: true });
export const Case = mongoose.model('Case', caseSchema);
