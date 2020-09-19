import * as fromRouter from '@ngrx/router-store';
import {
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
} from '@ngrx/store';
import { RouterStateUrl } from './helpers/custom-serializer';

export interface State {
  router: fromRouter.RouterReducerState<any>;
}

export const reducers: ActionReducerMap<State> = {
  router: fromRouter.routerReducer,
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
