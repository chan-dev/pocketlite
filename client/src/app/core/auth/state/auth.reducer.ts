import {
  createReducer,
  on,
  Action,
  createFeatureSelector,
  createSelector,
} from '@ngrx/store';

import { User } from '@models/user.model';
import * as authActions from './auth.actions';

// TODO: rename AuthState to just State
export interface AuthState {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  isTokenRefreshed: null | boolean;
}

const initialState: AuthState = {
  currentUser: null,
  loading: false,
  error: null,
  // NOTE: it's important that we set it as null since
  // we have different behaviour for false value
  isTokenRefreshed: null,
};

const authReducer = createReducer(
  initialState,
  on(authActions.login, state => ({ ...state, loading: true })),
  on(authActions.loginSuccess, (state, { currentUser }) => ({
    ...state,
    currentUser,
    loading: false,
    error: null,
  })),
  on(authActions.loginFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
    currentUser: null,
  })),
  on(authActions.logoutConfirm, authActions.forceLogout, state => ({
    ...state,
    loading: true,
  })),
  on(authActions.logoutSuccess, state => initialState),
  on(authActions.logoutFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  on(authActions.refreshToken, state => ({
    ...state,
    loading: true,
    isTokenRefreshed: null,
  })),
  on(authActions.refreshTokenSuccess, state => ({
    ...state,
    loading: false,
    isTokenRefreshed: true,
  })),
  on(authActions.refreshTokenFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
    isTokenRefreshed: false,
  }))
);

export function reducer(state: AuthState | undefined, action: Action) {
  return authReducer(state, action);
}

// Selectors
export const selectAuthState = createFeatureSelector<AuthState>('auth');
export const selectCurrentUser = createSelector(
  selectAuthState,
  state => state.currentUser
);
export const selectIsLoggedIn = createSelector(
  selectCurrentUser,
  currentUser => !!currentUser
);
export const selectAuthError = createSelector(
  selectAuthState,
  state => state.error
);
export const selectAuthIsLoading = createSelector(
  selectAuthState,
  state => state.loading
);
export const selectAuthIsTokenRefreshed = createSelector(
  selectAuthState,
  state => state.isTokenRefreshed
);
