import { Component, Input, OnChanges, OnInit, SimpleChanges, inject } from '@angular/core';
import { UserStoreService } from '../../user-store.service';
import { LocalStorageService } from '../../local-storage.service';
import { User } from '../../Models/User';
import { Router } from '@angular/router';
import { LoginStatusServiceService } from '../../login-status-service.service';
import { ThemeService } from '../../theme.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css', 
    '../../../themes/theme1.css', 
    '../../../themes/theme2.css',
    '../../../themes/theme3.css'
  ]
})
export class HeaderComponent implements OnInit, OnChanges {
  
  private router = inject(Router);
  private userStoreService = inject(UserStoreService);
  private loginStatusService = inject(LoginStatusServiceService);
  private localStorageService = inject(LocalStorageService);
  private themeService = inject(ThemeService);

  @Input() userIsLoggedIn: boolean = false;
  @Input() user: User | null = null;
  
  userStore!: User;
  
  numberOfTestsTaken!: number;
  timeSpentTyping!: number;
  username!: string;
  currentTheme!: string;
  
  
  ngOnInit(): void {
    this.themeService.getChosenTheme().subscribe(chosenTheme => {
      this.currentTheme = chosenTheme;
    })
  }
  
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user'] || changes['userIsLoggedIn']) {
      console.info("Header - User status: ", this.user);
      console.info("Header - Login status: ", this.userIsLoggedIn);
    }
  }

  logout() {
    this.userStoreService.updateForUserLogout();
    this.loginStatusService.userLoggedOut();

    this.router.navigate(['/']);
  }



}
