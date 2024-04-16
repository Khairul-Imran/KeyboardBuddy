import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserStoreService } from '../../user-store.service';
import { User } from '../../Models/User';
import { LocalStorageService } from '../../local-storage.service';
import { LoginStatusServiceService } from '../../login-status-service.service';
import { UserDataService } from '../../user-data.service';

@Component({
  selector: 'app-success-page',
  templateUrl: './success-page.component.html',
  styleUrl: './success-page.component.css'
})
export class SuccessPageComponent implements OnInit {
  
  private router = inject(Router);
  private userStoreService = inject(UserStoreService);
  private localStorageService = inject(LocalStorageService)
  private loginStatusService = inject(LoginStatusServiceService);
  private userDataService = inject(UserDataService);

  userComponentStore!: User;
  userLocalStorage!: User | undefined;
  
  ngOnInit(): void {
    this.userLocalStorage = this.localStorageService.getUserFromLocalStorage();
    
    if (this.userLocalStorage !== undefined) {
      this.userLocalStorage.userProfile.hasPremium = true; // Update hasPremium
      this.localStorageService.saveUserToLocalStorage(this.userLocalStorage);
      
      // Update component store
      this.userStoreService.updateUserStore(this.userLocalStorage);
      
      this.loginStatusService.userLoggedIn()
      
      // Update server.
      this.userDataService.updateUserProfileAfterPurchase(
        this.userLocalStorage.userId, 
        this.userLocalStorage.userProfile.hasPremium)
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
          
    this.userStoreService.user$.subscribe((userFromStore: User) => {
      this.userComponentStore = userFromStore;
    })

    console.info("Success page - User compoenent store: ", this.userComponentStore);
    console.info("Success page - User local store: ", this.userLocalStorage);
  }

  backToSettingsPage() {
    this.router.navigate(['/settings']);
  }

}
