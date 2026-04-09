const ApiError = require('../utils/ApiError');

const errorHandler = (err, req, res, next) => {
    let { statusCode, message } = err;

    // Default status code if not provided
    if (!statusCode) statusCode = 500;

    // Handle Mongoose Errors
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = Object.values(err.errors).map(val => val.message).join(', ');
    }
    if (err.code === 11000) {
        statusCode = 400;
        message = 'Duplicate field value entered';
    }
    if (err.name === 'CastError') {
        statusCode = 404;
        message = `Resource not found with id of ${err.value}`;
    }

    if (process.env.NODE_ENV === 'production' && !err.isOperational && statusCode === 500) {
        message = 'Internal Server Error';
    }

    const response = {
        success: false,
        statusCode,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    };

    if (process.env.NODE_ENV === 'development') {
        console.error(err);
    }

    res.status(statusCode).json(response);
};

module.exports = {
    errorHandler,
};
