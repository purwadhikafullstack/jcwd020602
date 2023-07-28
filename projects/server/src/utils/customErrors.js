class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.message == this.constructor.name;
    this.statusCode = statusCode || 500;
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends CustomError {
  constructor(message) {
    super(message || "Validation error", 400);
  }
}
class UnauthorizedError extends CustomError {
  constructor(message) {
    super(message || "Unauthorized", 401);
  }
}
class NotFoundError extends CustomError {
  constructor(message) {
    super(message || "Not Found", 404);
  }
}
class ConflictError extends CustomError {
  constructor(message) {
    super(message || "Conflict", 409);
  }
}
class InternalServerError extends CustomError {
  constructor(message) {
    super(message || "Internal Server Error", 500);
  }
}
class BadGatewayError extends CustomError {
  constructor(message) {
    super(message || "Bad Gateway", 502);
  }
}
class ServiceUnavailableError extends CustomError {
  constructor(message) {
    super(message || "Service Unavailable", 503);
  }
}
module.exports = {
  CustomError,
  ValidationError,
  UnauthorizedError,
  NotFoundError,
  ConflictError,
  InternalServerError,
  BadGatewayError,
  ServiceUnavailableError,
};
