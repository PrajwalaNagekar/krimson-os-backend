import { HTTP_STATUS } from '../utils/constants.js';

const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER;
    let message = err.message || 'Server Error';

    // Mongoose bad ObjectId
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        message = 'Resource not found';
        statusCode = HTTP_STATUS.NOT_FOUND;
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(val => val.message);
        message = messages.join(', ');
        statusCode = HTTP_STATUS.BAD_REQUEST;
    }

    // JWT invalid
    if (err.name === 'JsonWebTokenError') {
        message = 'Not authorized, token failed';
        statusCode = HTTP_STATUS.UNAUTHORIZED;
    }

    // JWT expired
    if (err.name === 'TokenExpiredError') {
        message = 'Not authorized, token expired';
        statusCode = HTTP_STATUS.UNAUTHORIZED;
    }

    // Log error for server observability
    console.error(`[Error] ${statusCode} - ${message}`, err);

    res.status(statusCode).json({
        success: false,
        message,
        // Hide stack trace in production for security
        stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
    });
};

export default errorHandler;
