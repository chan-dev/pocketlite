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
