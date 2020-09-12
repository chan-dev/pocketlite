import { createAction, props } from '@ngrx/store';

import { User } from '@models/user.model';

export const login = createAction('[Login Page] Login');
export const loginCallback = createAction('[Login Page] Login Callback');
export const loginSuccess = createAction(
  '[Auth API] Login Success',
  props<{ currentUser: User }>()
);
export const loginFailure = createAction(
  '[Auth API] Login Failure',
  props<{ error: string }>()
);

export const forceLogout = createAction('[TokenInterceptor] ForceLogout');
export const logout = createAction('[Header] Logout');
export const logoutConfirm = createAction(
  '[ConfirmDialogComponent] Logout Confirm'
);
export const logoutCancel = createAction(
  '[ConfirmDialogComponent] Logout Cancel'
);
export const logoutSuccess = createAction('[Auth API] Logout Success');
export const logoutFailure = createAction(
  '[Auth API] Logout Failure',
  props<{ error: string }>()
);

export const refreshToken = createAction('[TokenInterceptor] Refresh Token');
export const refreshTokenSuccess = createAction(
  '[Auth API] Refresh Token Success'
);
export const refreshTokenFailure = createAction(
  '[Auth API] Refresh Token Failure',
  props<{ error: string }>()
);
