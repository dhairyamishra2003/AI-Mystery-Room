export function errorHandler(error, req, res, next) {
  console.error(`${req.method} ${req.path}:`, error.message, error.cause || error.stack || '');
  if (error.name === 'ZodError') return res.status(400).json({ success: false, message: 'Invalid request data.', errorCode: 'VALIDATION_ERROR' });
  res.status(error.status || 500).json({ success: false, message: error.message || 'An unexpected server error occurred.', errorCode: error.code || 'INTERNAL_ERROR' });
}
