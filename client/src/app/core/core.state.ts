import * as fromRouter from '@ngrx/router-store';
import {
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
} from '@ngrx/store';

import { RouterStateUrl } from './helpers/custom-serializer';
import * as fromAuth from '@app/core/auth/state';

export interface State {
  router: fromRouter.RouterReducerState<any>;
  auth: fromAuth.AuthState;
}

export const reducers: ActionReducerMap<State> = {
  router: fromRouter.routerReducer,
  auth: fromAuth.reducer,
};

export const selectRouter = createFeatureSelector<
  State,
  fromRouter.RouterReducerState<RouterStateUrl>
>('router');

export const selectRouteState = createSelector(
  selectRouter,
  state => state.state
);

export const selectQueryParams = createSelector(
  selectRouteState,
  state => state.queryParams
);

export const selectRouteUrl = createSelector(
  selectRouteState,
  state => state.url
);

export const selectRouteParams = createSelector(
  selectRouteState,
  state => state.params
);
