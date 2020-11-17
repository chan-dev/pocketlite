import { Observable, defer, timer, combineLatest, merge } from 'rxjs';
import {
  distinctUntilChanged,
  mapTo,
  startWith,
  takeUntil,
} from 'rxjs/operators';

export const showLoaderTime = <T>(
  loaderDelay: number,
  timeAfterLoaderDelay: number
) => {
  return (source: Observable<T>): Observable<boolean> => {
    const obs$ = new Observable<boolean>(subscriber => {
      const loader$ = timer(loaderDelay).pipe(takeUntil(source), mapTo(true));

      const result$ = combineLatest([
        source,
        timer(loaderDelay + timeAfterLoaderDelay),
      ]).pipe(mapTo(false));

      return merge(loader$, result$)
        .pipe(startWith(false), distinctUntilChanged())
        .subscribe({
          next: value => {
            subscriber.next(value);
          },
          error: err => subscriber.error(err),
          complete: () => subscriber.complete(),
        });
    });

    return obs$;
  };
};
