export const enum HTTP_STATUS_CODES {
  BAD_REQUEST = 400,
  UNAUTHENTICATED = 401,
  FORBIDDEN = 403,
  RESOURCE_NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
  INVALID_DATA = 422,
}

export const enum ERROR_CODES {
  DUPLICATE_DATA = 'ERR_DUPS',
  INVALID_CSRF = 'ERR_INVALID_CSRF',
  JWT_TOKEN_EXPIRED = 'ERR_JWT_TOKEN_EXPIRED',
  REFRESH_TOKEN_EXPIRED = 'ERR_REFRESH_TOKEN_EXPIRED',
}
export interface ApiErrorMetadata {
  message: string;
  statusCode: HTTP_STATUS_CODES;
  name: string;
  errorCode: ERROR_CODES | null;
  payload?: any;
}
