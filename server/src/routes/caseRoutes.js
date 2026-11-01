import { Router } from 'express';
import { createCase, getCase, discoverClue, requestHint, accuse, getResult } from '../controllers/caseController.js';
import { requireCaseAccess } from '../middleware/caseAccessMiddleware.js';
const router = Router();
const asyncHandler = (handler) => (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
router.post('/', asyncHandler(createCase)); router.get('/:id', requireCaseAccess, asyncHandler(getCase)); router.post('/:id/clues/:clueId/discover', requireCaseAccess, asyncHandler(discoverClue)); router.post('/:id/hints', requireCaseAccess, asyncHandler(requestHint)); router.post('/:id/accuse', requireCaseAccess, asyncHandler(accuse)); router.get('/:id/result', requireCaseAccess, asyncHandler(getResult));
export default router;
