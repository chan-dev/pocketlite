import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map, catchError, mergeMap, exhaustMap, tap } from 'rxjs/operators';
import { Action, createAction } from '@ngrx/store';
import { createEffect, ofType, Actions } from '@ngrx/effects';

import * as tagsActions from '../actions/tags.actions';
import { TagsService } from '../../services/tags.service';
import { ConfirmDialogService } from '@app/shared/confirm-dialog/confirm-dialog.service';

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
                error,
              })
            )
          )
        )
      )
    );
  });

  deleteTag$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(tagsActions.deleteTag),
      exhaustMap(action => {
        this.confirmDialogService.open({
          title: 'Confirm Delete',
          message: 'Are you sure you want to delete?',
          cancelText: 'Cancel',
          confirmText: 'Delete',
        });

        return this.confirmDialogService.confirmed().pipe(
          map(confirm => {
            return confirm
              ? tagsActions.deleteTagConfirm({ tag: action.tag })
              : tagsActions.deleteTagCancel();
          })
        );
      })
    );
  });

  deleteTagConfirm$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(tagsActions.deleteTagConfirm),
      mergeMap(({ tag }) =>
        this.tagssService.deleteTag(tag.id).pipe(
          map(({ tag: deletedTag }) =>
            tagsActions.deleteTagSuccess({ tag: deletedTag })
          ),
          catchError(error =>
            of(
              tagsActions.deleteTagFailure({
                error,
                tag,
              })
            )
          )
        )
      )
    );
  });

  // TODO: navigate to next tag
  deleteTagSuccess$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(tagsActions.deleteTagSuccess),
        tap(_ => {
          console.log('navigating to next tag');
        })
      );
    },
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private tagssService: TagsService,
    private confirmDialogService: ConfirmDialogService
  ) {}

  ngrxOnInitEffects(): Action {
    // BookmarksModule is a featuremodule that's only
    // loaded once user has been authenticated, so it's say to
    // dispatch an action to query the current user's tags
    return tagsActions.getTags();
  }
}
