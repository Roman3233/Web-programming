class ApiError extends Error {
 constructor(statusCode, message, errors = []) {
 super(message);
 this.name = 'ApiError';
 this.statusCode = statusCode;
 this.errors = errors;
 Error.captureStackTrace?.(this, this.constructor);
 }

 static badRequest(message = 'Bad request', errors = []) {
 return new ApiError(400, message, errors);
 }

 static notFound(message = 'Not found') {
 return new ApiError(404, message);
 }

 static internal(message = 'Internal server error') {
 return new ApiError(500, message);
 }
}

module.exports = ApiError;
