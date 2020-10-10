import { Params, RouterStateSnapshot } from '@angular/router';
import { RouterStateSerializer } from '@ngrx/router-store';

export interface RouterStateUrl {
  url: string;
  params: Params;
  queryParams: Params;
}

export class CustomSerializer implements RouterStateSerializer<RouterStateUrl> {
  serialize(routerState: RouterStateSnapshot): RouterStateUrl {
    let route = routerState.root;

    while (route.firstChild) {
      route = route.firstChild;
    }

    const {
      url,
      root: { queryParams },
    } = routerState;
    const { params } = route;

    // Only return an object including the URL, params and query params
    // instead of the entire snapshot
    return {
      // NOTE: this is important, we must provide "/" as a replacement everytime
      // the route is equals an "" empty route to prevent infinite loop
      // on guards that redirect to the same component
      // Check issue here
      // https://github.com/ngrx/platform/issues/1781#issuecomment-489240115
      url: url || '/',
      params,
      queryParams,
    };
  }
}
