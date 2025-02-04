import { createAction, props } from '@ngrx/store';

export const loadUser = createAction(
  '[User] Load User',
  props<{ userId: string }>()
);

export const loadUserSuccess = createAction(
  '[User] Load User Success',
  props<{ user: any }>()
);

export const loadUserFailure = createAction(
  '[User] Load User Failure',
  props<{ error: string }>()
);