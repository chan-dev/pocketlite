import {
  RouteReuseStrategy,
  ActivatedRouteSnapshot,
  DetachedRouteHandle,
} from '@angular/router';
import { ComponentRef } from '@angular/core';
export class CustomRouteReuseStrategy extends RouteReuseStrategy {
  private readonly storedRouteHandles = new Map<string, DetachedRouteHandle>();

  // Explanation for the methods:
  // https://github.com/angular/angular/issues/16713#issuecomment-322113987

  /**
   * Decides if we're gonna detach and store the route we're navigating away from
   *
   * @param route the route we're navigating away from
   * @returns boolean determines if we store the current route snapshot
   */
  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return !!route.routeConfig && this.shouldReuse(route);
  }

  /**
   * Store the route handle of the route we're navigating away from
   *
   * @param route the route we're navigating away from
   * @param handle the route handle we're storing
   */
  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    this.storedRouteHandles.set(this.getKey(route), handle);
  }

  /**
   * Decides whether to reuse any stored route handle
   *
   * @param route the current route
   * @returns boolean indicates whether to use any matching stored route handle
   */
  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    if (this.resetRoute(route)) {
      this.displayStoredRouteHandles();
      this.deleteAllRouteHandles();
      this.displayStoredRouteHandles();
      return false;
    }
    return (
      !!route.routeConfig && !!this.storedRouteHandles.has(this.getKey(route))
    );
  }

  /**
   * Retrieves any matching stored route handle
   *
   * @param route the current route
   * @returns DetachedRouteHandle
   */
  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    return route.routeConfig
      ? this.storedRouteHandles.get(this.getKey(route))
      : null;
  }

  /**
   * NOTE: if this returns true, none of the other methods are fired
   *
   * @param future ironically is the route we're navigating away from
   * @param curr the route the user is navigating to
   * @returns boolean indicates whether to reuse the route
   */
  shouldReuseRoute(
    future: ActivatedRouteSnapshot,
    curr: ActivatedRouteSnapshot
  ): boolean {
    return future.routeConfig === curr.routeConfig;
  }

  /**
   * Determines if we reuse the route
   *
   * Make sure to add route data { data: { reuseRoute: true }} for any routes
   * you want to reuse
   *
   * @param route the route to check
   * @returns boolean indicates if this route is to be reused
   */
  private shouldReuse(route: ActivatedRouteSnapshot) {
    return !!route.data && route.data.reuseRoute === true;
  }

  /**
   * Traverse the current route snapshot
   * Adapted from https://stackoverflow.com/a/58737722/9732932
   *
   * This is to check if the current route snapshot has resetRoute
   * w/c is our indicator that we need to do cleanup and delete all
   * references to route handlers and destroy referenced components
   *
   * @param snapshot route snapshot to check
   */
  private resetRoute(snapshot: ActivatedRouteSnapshot) {
    const resetRouteFound = snapshot.pathFromRoot
      .map(v => v.data)
      .filter(v => v.resetRoute)
      // NOTE: we only care about the last segment in the route
      .pop();

    return resetRouteFound && resetRouteFound.resetRoute === true;
  }

  /**
   * Creates a unique key for the storedRouteHandles Map.
   * By convention, We use the route.routeConfig.path to generate unique keys
   *
   * This prevents issues with lazy-loaded or deeply nested modules where sometimes
   * the route.routeConfig.path is empty.
   *
   * @param route route to generate unique key from
   * @returns string concatenated paths of the current route starting from root route
   */
  private getKey(route: ActivatedRouteSnapshot): string {
    const routeFromRoot = route.pathFromRoot
      .map((el: ActivatedRouteSnapshot) =>
        el.routeConfig ? el.routeConfig.path : ''
      )
      .filter(str => str.length > 0)
      .join('/');

    return routeFromRoot;
  }

  private deleteAllRouteHandles() {
    this.storedRouteHandles.forEach(handle => this.destroyComponent(handle));
    this.storedRouteHandles.clear();
  }

  private destroyComponent(handle: DetachedRouteHandle): void {
    // tslint:disable-next-line: no-string-literal
    const componentRef: ComponentRef<any> = handle['componentRef'];
    if (componentRef) {
      componentRef.destroy();
    }
  }

  private displayCurrentPath(route: ActivatedRouteSnapshot) {
    console.log(
      'path:',
      route.routeConfig && route.routeConfig.path.length
        ? route.routeConfig.path
        : '/'
    );
  }

  private displayStoredRouteHandles() {
    console.log([...this.storedRouteHandles.keys()]);
    console.log([...this.storedRouteHandles.values()]);
  }
}
