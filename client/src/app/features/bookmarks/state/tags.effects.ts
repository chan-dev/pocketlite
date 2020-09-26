import { Injectable } from '@angular/core';
import { createEffect, ofType, Actions } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, mergeMap } from 'rxjs/operators';

import * as tagsActions from './tags.actions';
import { TagsService } from '../services/tags.service';
import { Action } from '@ngrx/store';

@Injectable()
export class TagEffects {
  getTagItems$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(tagsActions.getTags),
      mergeMap(() =>
        this.tagssService.fetchAll().pipe(
          map(tags => tagsActions.getTagsSuccess({ tags })),
          catchError(error =>
            of(
              tagsActions.getTagsFailure({
                error: error?.error?.message,
              })
            )
          )
        )
      )
    );
  });

  constructor(private actions$: Actions, private tagssService: TagsService) {}

  ngrxOnInitEffects(): Action {
    // BookmarksModule is a featuremodule that's only
    // loaded once user has been authenticated, so it's say to
    // dispatch an action to query the current user's tags
    return tagsActions.getTags();
  }
}
