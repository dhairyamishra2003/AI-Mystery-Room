import crypto from 'node:crypto';
import { Case } from '../models/Case.js';
export async function requireCaseAccess(req, res, next) {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, '');
  if (!token) return res.status(401).json({ success: false, message: 'A case access token is required.', errorCode: 'UNAUTHORIZED' });
  const hash = crypto.createHash('sha256').update(token).digest('hex');
  const caseFile = await Case.findById(req.params.id).select('+accessTokenHash');
  if (!caseFile) return res.status(404).json({ success: false, message: 'Case not found.', errorCode: 'CASE_NOT_FOUND' });
  const expected = Buffer.from(caseFile.accessTokenHash, 'hex'); const received = Buffer.from(hash, 'hex');
  if (expected.length !== received.length || !crypto.timingSafeEqual(expected, received)) return res.status(403).json({ success: false, message: 'You do not have access to this case.', errorCode: 'FORBIDDEN' });
  req.caseFile = caseFile; next();
}
