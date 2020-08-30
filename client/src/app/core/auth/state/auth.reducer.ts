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
}

const initialState: AuthState = {
  currentUser: null,
  loading: false,
  error: null,
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
  on(authActions.logout, state => ({ ...state, loading: true })),
  on(authActions.logoutSuccess, state => initialState),
  on(authActions.logoutFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
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
