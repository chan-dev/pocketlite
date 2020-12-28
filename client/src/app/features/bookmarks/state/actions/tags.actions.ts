import { createAction, props } from '@ngrx/store';
import { Tag } from '@models/tag.model';

export const getTags = createAction('[TagEffects] Get Tags');
export const getTagsSuccess = createAction(
  '[Tags API] Get Tags Success',
  props<{ tags: Tag[] }>()
);
export const getTagsFailure = createAction(
  '[Tags API] Get Tags Failure',
  props<{ error: string }>()
);
export const deleteTag = createAction(
  '[TagsContainerComponent] Delete Tag',
  props<{ tag: Tag }>()
);
export const deleteTagConfirm = createAction(
  '[TagEffects] Delete Tag Confirm',
  props<{ tag: Tag }>()
);
export const deleteTagCancel = createAction('[TagEffects] Delete Tag Cancel');
export const deleteTagSuccess = createAction(
  '[Tags API] Delete Tag Success',
  props<{ tag: Tag }>()
);
export const deleteTagFailure = createAction(
  '[Tags API] Delete Tag Failure',
  props<{ error: string; tag: Tag }>()
);
