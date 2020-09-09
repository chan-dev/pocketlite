import {
  RouteReuseStrategy,
  ActivatedRouteSnapshot,
  DetachedRouteHandle,
} from '@angular/router';
export class CustomRouteReuseStrategy extends RouteReuseStrategy {
  private readonly storedRouteHandles = new Map<string, DetachedRouteHandle>();

  /**
   * Decides if we're gonna store the route we're navigating away from
   *
   * @param route the route we're navigating away from
   * @returns boolean determines if we continue to store() method
   */
  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return this.shouldReuse(route);
  }

  /**
   * Store the route handle of the route we're navigating away from
   *
   * @param route the route we're navigating away from
   * @param handle the route handle we're storing
   */
  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    this.storedRouteHandles.set(route.routeConfig.path, handle);
  }

  /**
   * Decides whether to reuse any stored route handle
   *
   * @param route the current route
   * @returns boolean indicates whether to use any matching stored route handle
   */
  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    return this.storedRouteHandles.has(route?.routeConfig?.path);
  }

  /**
   * Retrieves any matching stored route handle
   *
   * @param route the current route
   * @returns DetachedRouteHandle
   */
  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
    return this.storedRouteHandles.get(route?.routeConfig?.path);
  }

  /**
   * NOTE: if this returns true, none of the other methods are fired
   *
   * @param future the route the user is navigating to
   * @param curr the route the user is navigating away from
   * @returns boolean indicates whether to reuse the route
   */
  shouldReuseRoute(
    future: ActivatedRouteSnapshot,
    curr: ActivatedRouteSnapshot
  ): boolean {
    return this.shouldReuse(future) && future.routeConfig === curr.routeConfig;
  }

  /**
   * Determines if we reuse the route
   * By default, If route.data.reuseRoute is not specified, then reuse the route
   * If route.data.reuseRoute is explicitly specified, check if it's true
   *
   * @param route the route to check
   * @returns boolean indicates if this route is to be reused
   */
  private shouldReuse(route: ActivatedRouteSnapshot) {
    return (
      !route.data.hasOwnProperty('reuseRoute') || route.data.reuseRoute === true
    );
  }

  private displayStoredRouteHandles() {
    return [...this.storedRouteHandles.values()];
  }
}
