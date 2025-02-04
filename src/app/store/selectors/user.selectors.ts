import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState } from '../state/user.state';

export const selectUserState = createFeatureSelector<UserState>('user');

export const selectUser = createSelector(
  selectUserState,
  (state) => state.user
);

export const selectUserName = createSelector(
    selectUserState,
    (state: UserState) => state.user?.fullName // Use 'fullName' instead of firstName/lastName
  );