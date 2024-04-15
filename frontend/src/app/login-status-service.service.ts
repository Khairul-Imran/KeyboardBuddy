import { Injectable } from '@angular/core';
import { UserLoginState } from './Models/User';
import { ComponentStore } from '@ngrx/component-store';

@Injectable({
  providedIn: 'root'
})
export class LoginStatusServiceService extends ComponentStore<UserLoginState> {

  constructor() {
    super ({ isUserLoggedIn: false } as UserLoginState);
  }

  // Subscribe to this to determine state.
  readonly userLogInStatus$ = this.select((state) => state.isUserLoggedIn);


  // To update that the user has logged in.
  readonly userLoggedIn = this.updater((state) => ({
    ...state,
    isUserLoggedIn: true
  }));

  // To update that the user has logged out.
  readonly userLoggedOut = this.updater((state) => ({
    ...state,
    isUserLoggedIn: false
  }));

}
