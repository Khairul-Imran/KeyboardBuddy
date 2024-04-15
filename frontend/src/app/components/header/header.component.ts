import { Component, Input, OnChanges, OnInit, SimpleChanges, inject } from '@angular/core';
import { UserStoreService } from '../../user-store.service';
import { LocalStorageService } from '../../local-storage.service';
import { User } from '../../Models/User';
import { Router } from '@angular/router';
import { LoginStatusServiceService } from '../../login-status-service.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnChanges {
  
  private router = inject(Router);
  private userStoreService = inject(UserStoreService);
  private loginStatusService = inject(LoginStatusServiceService);
  private localStorageService = inject(LocalStorageService);

  @Input() userIsLoggedIn: boolean = false;
  @Input() user: User | null = null;
  
  userStore!: User;
  
  numberOfTestsTaken!: number;
  timeSpentTyping!: number;
  username!: string;
  
  // To have the user profile's information here.
  
  // If user is logged in already (there is component store data and local store data) -> show profile button / hide login button
  // If user is not logged in (there is no component store data or local store data) -> show login button / hide profile button
  
  
  
  ngOnInit(): void {
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
