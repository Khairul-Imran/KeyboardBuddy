import { Component, OnInit, inject } from '@angular/core';
import { LoginStatusServiceService } from './login-status-service.service';
import { UserStoreService } from './user-store.service';
import { User, UserLoginState } from './Models/User';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'frontend';
  
  private loginStatusService = inject(LoginStatusServiceService);
  private userStoreService = inject(UserStoreService);

  userStore!: User;
  userLoginState!: boolean;
  
  ngOnInit(): void {

    this.userStoreService.user$.subscribe((userFromStore: User) => {
      this.userStore = userFromStore;
    })

    this.loginStatusService.userLogInStatus$.subscribe((userLoginStateFromStore) => {
      this.userLoginState = userLoginStateFromStore;
    })

  }

}
