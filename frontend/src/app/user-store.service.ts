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
  
  // If store is empty, route user to registration/login page
  // ngrxOnStoreInit(): void {

  // }

  readonly user$ = this.select(state => state);
  
  readonly updateUserStore = this.updater((state, user: User) => ({
    ...state,
    ...user
  }));

  // Need to update for user logout too.
  

}
