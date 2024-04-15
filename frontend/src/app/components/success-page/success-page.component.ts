import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserStoreService } from '../../user-store.service';
import { User } from '../../Models/User';
import { LocalStorageService } from '../../local-storage.service';

@Component({
  selector: 'app-success-page',
  templateUrl: './success-page.component.html',
  styleUrl: './success-page.component.css'
})
export class SuccessPageComponent implements OnInit {
  
  private router = inject(Router);
  private userStoreService = inject(UserStoreService);
  private localStorageService = inject(LocalStorageService)

  userStore!: User;
  userLocalStorage!: User | undefined;
  
  ngOnInit(): void {
    // this.userStoreService.user$.subscribe((userFromStore: User) => {
    //   this.userStore = userFromStore;
    // })
    this.userLocalStorage = this.localStorageService.getUserFromLocalStorage();
    

    console.info("Success page - User compoenent store: ", this.userStore);
    console.info("Success page - User local store: ", this.userLocalStorage);
  }

  // Able to get user from the local store
  // -> update in the local store to user hasPremium TRUE
  // Then use the local store to update component store
  // Then send the details back to the server.




  backToSettingsPage() {
    this.router.navigate(['/settings']);
  }

}
