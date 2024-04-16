import { Component, OnInit, inject } from '@angular/core';
import { LoginStatusServiceService } from './login-status-service.service';
import { UserStoreService } from './user-store.service';
import { User, UserLoginState } from './Models/User';
import { ThemeService } from './theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css', 
    '../themes/theme0.css',
    '../themes/theme1.css', 
    '../themes/theme2.css',
    '../themes/theme3.css'
  ]
})
export class AppComponent implements OnInit {
  title = 'frontend';
  
  private loginStatusService = inject(LoginStatusServiceService);
  private userStoreService = inject(UserStoreService);
  private themeService = inject(ThemeService);

  userStore!: User;
  userLoginState!: boolean;
  currentTheme!: string;
  
  ngOnInit(): void {

    this.userStoreService.user$.subscribe((userFromStore: User) => {
      this.userStore = userFromStore;
    })

    this.loginStatusService.userLogInStatus$.subscribe((userLoginStateFromStore) => {
      this.userLoginState = userLoginStateFromStore;
    })

    this.themeService.getChosenTheme().subscribe(chosenTheme => {
      this.currentTheme = chosenTheme;
    })

  }

}
