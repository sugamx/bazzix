import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import * as UserActions from '../actions/user_actions';
import { of } from 'rxjs';
import { UserService } from '../../user.service';


@Injectable()
export class UserEffects {
  loadUser$; // Declare the effect without initializing here

  constructor(
    private readonly actions$: Actions,
    private readonly userService: UserService
  ) {
    console.log('UserEffects constructor called');
    console.log('actions$ is:', this.actions$);

    // Initialize the effect inside the constructor
    this.loadUser$ = createEffect(() =>
      this.actions$.pipe(
        tap(action => console.log('Received action:', action)),
        ofType(UserActions.loadUser),
        mergeMap(action => {
          console.log('Processing action:', action);
          return this.userService.getUserById(action.userId).pipe(
            map(user => UserActions.loadUserSuccess({ user })),
            catchError(error => {
              console.error('Error in effect:', error);
              return of(UserActions.loadUserFailure({ error: error.message }));
            })
          );
        })
      )
    );
  }
}