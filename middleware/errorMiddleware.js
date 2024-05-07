import ClientError from '../error/ClientError';

const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  if (!err) {
    next();
    return;
  }

  let statusCode;
  let message;

  if (err instanceof ClientError) {
    statusCode = err.statusCode;
    message = err.message;
  } else {
    statusCode = err.statusCode === 200 ? 500 : err.statusCode;
    message = err.message || 'Internal Server Error';
  }

  res.status(statusCode).json({
    message: message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

export { notFound, errorHandler };
