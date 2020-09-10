import { HTTP_STATUS_CODES, ERROR_CODES } from '../constants/error';

export class ApiError extends Error {
  constructor(
    public message: string,
    public statusCode: HTTP_STATUS_CODES,
    public name: string = 'ApiError',
    public errorCode: ERROR_CODES | null
  ) {
    super(message);
    this.statusCode = statusCode;
    this.name = name;
    this.errorCode = errorCode;

    Error.captureStackTrace(this, ApiError);
  }

  static badRequest(message: string): HttpBadRequest {
    return new HttpBadRequest(message);
  }

  static unauthenticated(message: string): HttpUnauthenticated {
    return new HttpUnauthenticated(message);
  }

  static invalidData(message: string): HttpInvalidData {
    return new HttpInvalidData(message);
  }

  static resourceNotFound(message: string): HttpResourceNotFound {
    return new HttpResourceNotFound(message);
  }

  static forbidden(message: string): HttpForbidden {
    return new HttpForbidden(message);
  }

  static internalServerError(message: string): HttpInternalServerError {
    return new HttpInternalServerError(message);
  }

  static duplicateData(message: string): DuplicateData {
    return new DuplicateData(message);
  }

  static invalidCsrfToken(message: string): InvalidCsrfToken {
    return new InvalidCsrfToken(message);
  }

  static refreshTokenExpired(message: string): RefreshTokenExpired {
    return new RefreshTokenExpired(message);
  }
}

export class HttpBadRequest extends ApiError {
  constructor(
    public message: string,
    public statusCode: HTTP_STATUS_CODES = HTTP_STATUS_CODES.BAD_REQUEST,
    public name: string = 'ApiError.HttpBadRequest',
    public errorCode: ERROR_CODES | null = null
  ) {
    super(message, statusCode, name, errorCode);
    Error.captureStackTrace(this, HttpBadRequest);
  }
}

export class HttpUnauthenticated extends ApiError {
  constructor(
    public message: string,
    public statusCode: HTTP_STATUS_CODES = HTTP_STATUS_CODES.UNAUTHENTICATED,
    public name: string = 'ApiError.HttpUnauthenticated',
    public errorCode: ERROR_CODES | null = null
  ) {
    super(message, statusCode, name, errorCode);
    Error.captureStackTrace(this, HttpUnauthenticated);
  }
}

export class HttpInvalidData extends ApiError {
  constructor(
    public message: string,
    public statusCode: HTTP_STATUS_CODES = HTTP_STATUS_CODES.INVALID_DATA,
    public name: string = 'ApiError.HttpInvalidData',
    public errorCode: ERROR_CODES | null = null
  ) {
    super(message, statusCode, name, errorCode);
    Error.captureStackTrace(this, HttpInvalidData);
  }
}

export class HttpResourceNotFound extends ApiError {
  constructor(
    public message: string,
    public statusCode: HTTP_STATUS_CODES = HTTP_STATUS_CODES.RESOURCE_NOT_FOUND,
    public name: string = 'ApiError.HttpResourceNotFound',
    public errorCode: ERROR_CODES | null = null
  ) {
    super(message, statusCode, name, errorCode);
    Error.captureStackTrace(this, HttpResourceNotFound);
  }
}

export class HttpForbidden extends ApiError {
  constructor(
    public message: string,
    public statusCode: HTTP_STATUS_CODES = HTTP_STATUS_CODES.FORBIDDEN,
    public name: string = 'ApiError.HttpForbidden',
    public errorCode: ERROR_CODES | null = null
  ) {
    super(message, statusCode, name, errorCode);
    Error.captureStackTrace(this, HttpForbidden);
  }
}

export class HttpInternalServerError extends ApiError {
  constructor(
    public message: string,
    public statusCode: HTTP_STATUS_CODES = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
    public name: string = 'ApiError.HttpInternalServerError',
    public errorCode: ERROR_CODES | null = null
  ) {
    super(message, statusCode, name, errorCode);
    Error.captureStackTrace(this, HttpInternalServerError);
  }
}

export class DuplicateData extends ApiError {
  constructor(
    public message: string,
    public statusCode: HTTP_STATUS_CODES = HTTP_STATUS_CODES.INVALID_DATA,
    public name: string = 'ApiError.DuplicateData',
    public errorCode: ERROR_CODES = ERROR_CODES.DUPLICATE_DATA
  ) {
    super(message, statusCode, name, errorCode);
    Error.captureStackTrace(this, DuplicateData);
  }
}

export class InvalidCsrfToken extends ApiError {
  constructor(
    public message: string,
    public statusCode: HTTP_STATUS_CODES = HTTP_STATUS_CODES.FORBIDDEN,
    public name: string = 'ApiError.InvalidCsrf',
    public errorCode: ERROR_CODES = ERROR_CODES.INVALID_CSRF
  ) {
    super(message, statusCode, name, errorCode);
    Error.captureStackTrace(this, InvalidCsrfToken);
  }
}

export class RefreshTokenExpired extends ApiError {
  constructor(
    public message: string,
    public statusCode: HTTP_STATUS_CODES = HTTP_STATUS_CODES.UNAUTHENTICATED,
    public name: string = 'ApiError.RefreshTokenExpired',
    public errorCode: ERROR_CODES = ERROR_CODES.REFRESH_TOKEN
  ) {
    super(message, statusCode, name, errorCode);
    Error.captureStackTrace(this, RefreshTokenExpired);
  }
}
