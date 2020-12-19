import {
  HTTP_STATUS_CODES,
  ERROR_CODES,
  ApiErrorMetadata,
} from '../constants/error';

export class ApiError extends Error {
  public message: string = '';
  public statusCode: HTTP_STATUS_CODES;
  public name: string = 'ApiError';
  public errorCode: ERROR_CODES | null;
  public payload?: any;

  constructor(private metadata: ApiErrorMetadata) {
    super(metadata.message);
    this.statusCode = metadata.statusCode;
    this.name = metadata.name;
    this.errorCode = metadata.errorCode;
    this.payload = metadata.payload;

    Error.captureStackTrace(this, ApiError);
  }

  static badRequest(message: string, payload?: any): HttpBadRequest {
    return new HttpBadRequest(message, payload);
  }

  static unauthenticated(message: string, payload?: any): HttpUnauthenticated {
    return new HttpUnauthenticated(message, payload);
  }

  static invalidData(message: string, payload?: any): HttpInvalidData {
    return new HttpInvalidData(message, payload);
  }

  static resourceNotFound(
    message: string,
    payload?: any
  ): HttpResourceNotFound {
    return new HttpResourceNotFound(message, payload);
  }

  static forbidden(message: string, payload?: any): HttpForbidden {
    return new HttpForbidden(message, payload);
  }

  static internalServerError(
    message: string,
    payload?: any
  ): HttpInternalServerError {
    return new HttpInternalServerError(message, payload);
  }

  static duplicateData(message: string, payload?: any): DuplicateData {
    return new DuplicateData(message, payload);
  }

  static invalidCsrfToken(message: string, payload?: any): InvalidCsrfToken {
    return new InvalidCsrfToken(message, payload);
  }

  static refreshTokenExpired(
    message: string,
    payload?: any
  ): RefreshTokenExpired {
    return new RefreshTokenExpired(message, payload);
  }

  static jwtTokenExpired(message: string, payload?: any): JwtTokenExpired {
    return new JwtTokenExpired(message, payload);
  }
}

export class HttpBadRequest extends ApiError {
  constructor(public message: string, public payload?: any) {
    super({
      message,
      statusCode: HTTP_STATUS_CODES.BAD_REQUEST,
      name: 'ApiError.HttpBadRequest',
      errorCode: null,
      payload,
    });
    Error.captureStackTrace(this, HttpBadRequest);
  }
}

export class HttpUnauthenticated extends ApiError {
  constructor(public message: string, public payload?: any) {
    super({
      message,
      statusCode: HTTP_STATUS_CODES.UNAUTHENTICATED,
      name: 'ApiError.HttpUnauthenticated',
      errorCode: null,
      payload,
    });
    Error.captureStackTrace(this, HttpUnauthenticated);
  }
}

export class HttpInvalidData extends ApiError {
  constructor(public message: string, public payload?: any) {
    super({
      message,
      statusCode: HTTP_STATUS_CODES.INVALID_DATA,
      name: 'ApiError.HttpInvalidData',
      errorCode: null,
      payload,
    });
    Error.captureStackTrace(this, HttpInvalidData);
  }
}

export class HttpResourceNotFound extends ApiError {
  constructor(public message: string, public payload?: any) {
    super({
      message,
      statusCode: HTTP_STATUS_CODES.RESOURCE_NOT_FOUND,
      name: 'ApiError.HttpResourceNotFound',
      errorCode: null,
      payload,
    });
    Error.captureStackTrace(this, HttpResourceNotFound);
  }
}

export class HttpForbidden extends ApiError {
  constructor(public message: string, public payload?: any) {
    super({
      message,
      statusCode: HTTP_STATUS_CODES.FORBIDDEN,
      name: 'ApiError.HttpForbidden',
      errorCode: null,
      payload,
    });
    Error.captureStackTrace(this, HttpForbidden);
  }
}

export class HttpInternalServerError extends ApiError {
  constructor(public message: string, public payload?: any) {
    super({
      message,
      statusCode: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
      name: 'ApiError.HttpInternalServerError',
      errorCode: null,
      payload,
    });
    Error.captureStackTrace(this, HttpInternalServerError);
  }
}

export class DuplicateData extends ApiError {
  constructor(public message: string, public payload?: any) {
    super({
      message,
      statusCode: HTTP_STATUS_CODES.INVALID_DATA,
      name: 'ApiError.DuplicateData',
      errorCode: ERROR_CODES.DUPLICATE_DATA,
      payload,
    });
    Error.captureStackTrace(this, DuplicateData);
  }
}

export class InvalidCsrfToken extends ApiError {
  constructor(public message: string, public payload?: any) {
    super({
      message,
      statusCode: HTTP_STATUS_CODES.FORBIDDEN,
      name: 'ApiError.InvalidCsrf',
      errorCode: ERROR_CODES.INVALID_CSRF,
      payload,
    });
    Error.captureStackTrace(this, InvalidCsrfToken);
  }
}

export class RefreshTokenExpired extends ApiError {
  constructor(public message: string, public payload?: any) {
    super({
      message,
      statusCode: HTTP_STATUS_CODES.FORBIDDEN,
      name: 'ApiError.RefreshTokenExpired',
      errorCode: ERROR_CODES.REFRESH_TOKEN_EXPIRED,
      payload,
    });
    Error.captureStackTrace(this, RefreshTokenExpired);
  }
}

export class JwtTokenExpired extends ApiError {
  constructor(public message: string, public payload?: any) {
    super({
      message,
      statusCode: HTTP_STATUS_CODES.UNAUTHENTICATED,
      name: 'ApiError.JwtTokenExpired',
      errorCode: ERROR_CODES.JWT_TOKEN_EXPIRED,
      payload,
    });
    Error.captureStackTrace(this, JwtTokenExpired);
  }
}
