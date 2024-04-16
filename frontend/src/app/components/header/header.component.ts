import { Component, Input, OnChanges, OnInit, SimpleChanges, inject } from '@angular/core';
import { UserStoreService } from '../../user-store.service';
import { LocalStorageService } from '../../local-storage.service';
import { User } from '../../Models/User';
import { Router } from '@angular/router';
import { LoginStatusServiceService } from '../../login-status-service.service';
import { ThemeService } from '../../theme.service';
import { UserDataService } from '../../user-data.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnChanges {
  
  private router = inject(Router);
  private userStoreService = inject(UserStoreService);
  private loginStatusService = inject(LoginStatusServiceService);
  private localStorageService = inject(LocalStorageService);
  private themeService = inject(ThemeService);
  private userDataService = inject(UserDataService);

  @Input() userIsLoggedIn: boolean = false;
  @Input() user: User | null = null;
  
  userComponentStore!: User;
  userLocalStorage!: User | undefined;
  
  numberOfTestsTaken!: number;
  timeSpentTyping!: number;
  username!: string;
  currentTheme!: string;
  
  
  ngOnInit(): void {
    // this.themeService.getChosenTheme().subscribe(chosenTheme => {
    //   this.currentTheme = chosenTheme;
    // })

    this.userLocalStorage = this.localStorageService.getUserFromLocalStorage();
    console.info("Header Component - userLocalStore onInit: ", this.userLocalStorage);

    this.userStoreService.user$.subscribe((userFromStore: User) => {
      this.userComponentStore = userFromStore;
    })

  }
  
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user'] || changes['userIsLoggedIn']) {
      console.info("Header - User status: ", this.user);
      console.info("Header - Login status: ", this.userIsLoggedIn);

      this.userLocalStorage = this.localStorageService.getUserFromLocalStorage();
      console.info("Header Component - userLocalStore onInit: ", this.userLocalStorage);
    }
  }

  logout() {

    console.info("Logging out - userComponentStore: ", this.userComponentStore);
    console.info("Logging out - userLocalStore: ", this.userLocalStorage);

    if (this.userComponentStore.userProfile.hasPremium === true) {

      // To update server of theme chosen
      this.userDataService.updateUserProfileTheme(
        this.userComponentStore.userId, 
        this.userComponentStore.userProfile.selectedTheme)
          .then(
            response => {
              console.log(response);
            }
          )
          .catch(
            error => {
              console.error("Error updating the data: ", error);
            }
          );
    }

    this.userStoreService.updateForUserLogout();
    this.localStorageService.removeUserFromLocalStorage();
    this.loginStatusService.userLoggedOut();

    // Sets the theme back to default after user logs out.
    this.currentTheme = 'theme0';
    this.themeService.sendUpdatedTheme(this.currentTheme);

    this.router.navigate(['/']);
  }

}
