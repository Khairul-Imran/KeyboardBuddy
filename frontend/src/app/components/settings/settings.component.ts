import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ThemeService } from '../../theme.service';
import { Router } from '@angular/router';
import { UserStoreService } from '../../user-store.service';
import { LocalStorageService } from '../../local-storage.service';
import { User } from '../../Models/User';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {

  private themeService = inject(ThemeService);
  private router = inject(Router)
  private userStoreService = inject(UserStoreService);
  private localStorageService = inject(LocalStorageService);
  
  // chosenTheme!: string;
  currentTheme!: string;
  // selectTheme(theme: string) {
  //   this.chosenTheme = theme;
  // }

  userComponentStore!: User;
  userLocalStorage!: User | undefined;

  ngOnInit(): void {
    this.userLocalStorage = this.localStorageService.getUserFromLocalStorage();
    this.userStoreService.user$.subscribe((userFromStore: User) => {
      this.userComponentStore = userFromStore;
    })

    // this.themeService.getChosenTheme().subscribe(chosenTheme => {
    //   this.currentTheme = chosenTheme;
    // })
  }


  detectThemeChanges(newTheme: string) {
    this.themeService.sendUpdatedTheme(newTheme);
    // Update the component store and local store.
    if (this.userLocalStorage !== undefined) {
      this.userLocalStorage.userProfile.selectedTheme = newTheme; // Update selectedTheme
      this.localStorageService.saveUserToLocalStorage(this.userLocalStorage);

      // Update component store
      this.userStoreService.updateUserStore(this.userLocalStorage);
    }
  }

  goToOrderPreviewPage() {
    this.router.navigate(['/order-preview']);
  }

}
