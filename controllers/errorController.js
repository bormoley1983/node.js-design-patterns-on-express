module.exports = (err, req, resp, next) => {
  //  console.log(err.stack);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  resp.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};
