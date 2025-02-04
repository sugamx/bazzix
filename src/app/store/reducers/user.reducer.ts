import { createReducer, on } from '@ngrx/store';
import { UserState, initialUserState } from '../state/user.state';
import * as UserActions from '../actions/user_actions';

export const userReducer = createReducer(
  initialUserState,
  on(UserActions.loadUser, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(UserActions.loadUserSuccess, (state, { user }) => ({
    ...state,
    user,
    loading: false
  })),
  on(UserActions.loadUserFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  }))
);