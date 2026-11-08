export function errorHandler(error, req, res, next) {
  console.error(`${req.method} ${req.path}:`, error.message, error.cause || error.stack || '');
  if (error.name === 'ZodError') {
    const message = error.errors?.[0]?.message || 'Invalid request data.';
    return res.status(400).json({
      success: false,
      message,
      errorCode: 'VALIDATION_ERROR',
      errors: error.errors
    });
  }
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'An unexpected server error occurred.',
    errorCode: error.code || 'INTERNAL_ERROR'
  });
}
