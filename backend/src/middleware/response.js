export function responseMiddleware(_req, res, next) {
  res.respond = (body, statusCode = 200) => res.status(statusCode).json(body);
  res.respondError = (message, statusCode = 500) => res.respond({ error: message }, statusCode);

  next();
}

export function notFoundHandler(_req, res) {
  return res.respondError('Not Found', 404);
}

export function errorHandler(error, _req, res, next) {
  if (res.headersSent) return next(error);

  const statusCode = Number.isInteger(error.statusCode) ? error.statusCode : 500;
  const message = statusCode >= 500 ? 'Internal Server Error' : error.message;

  console.error('Unhandled request error:', error);
  return res.respondError(message, statusCode);
}
