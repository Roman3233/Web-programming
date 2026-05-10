const ApiError = require('../errors/ApiError');

module.exports = (err, req, res, next) => {
 let statusCode = err.statusCode || 500;
 let message = err.message || 'Internal server error';
 let errors = err.errors || [];

 if (err instanceof ApiError) {
 statusCode = err.statusCode;
 message = err.message;
 errors = err.errors || [];
 } else if (err.name === 'CastError') {
 statusCode = 400;
 message = 'Validation error';
 errors = [{ field: err.path, msg: `${err.path}: must be a valid MongoDB ObjectId` }];
 } else if (err.name === 'ValidationError') {
 statusCode = 400;
 message = 'Validation error';
 errors = Object.values(err.errors).map((validationError) => ({
 field: validationError.path,
 msg: validationError.message
 }));
 }

 const timestamp = new Date().toISOString();
 console.error(`[${timestamp}] ${req.method} ${req.originalUrl}`);
 console.error(err.stack || err.message || err);

 return res.status(statusCode).json({
 success: false,
 message,
 errors,
 statusCode
 });
};
