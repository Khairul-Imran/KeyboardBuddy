import { Injectable, inject } from '@angular/core';
import { ComponentStore, OnStoreInit } from '@ngrx/component-store';
import { SLICE_INIT_STATE, User, UserSlice } from './Models/User';
import { UserDataService } from './user-data.service';

@Injectable({
  providedIn: 'root'
})
export class UserStoreService extends ComponentStore<User> {

  constructor() {
    super({} as User);
  }
  
  private userDataService = inject(UserDataService);

  // Subscribe to the changes using this.
  readonly user$ = this.select(state => state);
  
  // Updates the store
  readonly updateUserStore = this.updater((state, user: User) => ({
    ...state,
    ...user
  }));

  // Updates the store when logging out
  readonly updateForUserLogout = this.updater((state) => ({
    ...state,
    user: null
  }))
  

}
