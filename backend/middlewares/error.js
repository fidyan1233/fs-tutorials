class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

const errorMiddleware = (err, req, res, next) => {
  // Default message and status code if not set
  err.message = err.message || "Internal Server Error";
  err.statusCode = err.statusCode || 500;

  // Handle CastError (Invalid object ID format)
  if (err.name === "CastError") {
    const message = `Resource not found. Invalid ${err.path}`;
    err = new ErrorHandler(message, 400);  // Create new ErrorHandler instance
  }

  // Handle duplicate key error (MongoDB duplicate key error)
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
    err = new ErrorHandler(message, 400);  // Create new ErrorHandler instance
  }

  // Handle invalid JWT error
  if (err.name === "JsonWebTokenError") {
    const message = `JSON Web Token is invalid, try again!`;
    err = new ErrorHandler(message, 400);  // Create new ErrorHandler instance
  }

  // Handle expired JWT error
  if (err.name === "TokenExpiredError") {
    const message = `JSON Web Token is expired, try again!`;
    err = new ErrorHandler(message, 400);  // Create new ErrorHandler instance
  }

  // Send the response with the error message and status code
  return res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

module.exports = {
  errorMiddleware,
  ErrorHandler
};
