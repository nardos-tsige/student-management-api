const errorHandler = (err, req, res, next) => {
  let status = err.status || 500;
  let message = err.message || 'Internal Server Error';

  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    status = 400;
    message = 'Malformed JSON payload provided';
  }

  res.status(status).json({
    success: false,
    error: {
      message,
      status
    }
  });
};

module.exports = errorHandler;
