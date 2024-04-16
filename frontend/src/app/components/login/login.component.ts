import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DEFAULT_LOGIN, DEFAULT_REGISTRATION, User, UserLogin, UserRegistration, UserSlice } from '../../Models/User';
import { UserDataService } from '../../user-data.service';
import { UserStoreService } from '../../user-store.service';
import { LocalStorageService } from '../../local-storage.service';
import { LoginStatusServiceService } from '../../login-status-service.service';
import { ThemeService } from '../../theme.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  // Registration and Login is done here

  private router = inject(Router);
  private formBuilder = inject(FormBuilder);
  private userDataService = inject(UserDataService);
  private userStoreService = inject(UserStoreService);
  private localStorageService = inject(LocalStorageService);
  private loginStatusService = inject(LoginStatusServiceService);
  private themeService = inject(ThemeService);
  
  registrationForm!: FormGroup;
  loginForm!: FormGroup;
  
  defaultRegistration: UserRegistration = DEFAULT_REGISTRATION;
  defaultLogin: UserLogin = DEFAULT_LOGIN;

  userLocalStore!: User | undefined;
  userComponentStore!: User;

  ngOnInit(): void {
    this.registrationForm = this.createUserRegistrationForm(this.defaultRegistration);
    this.loginForm = this.createUserLoginForm(this.defaultLogin);
  }

  private createUserRegistrationForm(userRegistration: UserRegistration): FormGroup {

    return this.formBuilder.group({
      username: this.formBuilder.control<string>(userRegistration.username, [Validators.required, Validators.minLength(5), Validators.maxLength(10)]),
      email: this.formBuilder.control<string>(userRegistration.email, [Validators.required, Validators.email]),
      password: this.formBuilder.control<string>(userRegistration.password, [Validators.required, Validators.minLength(5), Validators.maxLength(10)])
    });
  }

  private createUserLoginForm(userLogin: UserLogin): FormGroup {

    return this.formBuilder.group({
      email: this.formBuilder.control<string>(userLogin.email, [Validators.required, Validators.email]),
      password: this.formBuilder.control<string>(userLogin.password, [Validators.required, Validators.minLength(5), Validators.maxLength(10)])
    });
  }

  submitUserRegistrationForm() {
    const userRegistrationFromForm: UserRegistration = this.registrationForm.value;
    console.info("Processing user registration: ", userRegistrationFromForm);

    this.userDataService.postUserRegistration(userRegistrationFromForm)
      .then(response => {
        const user: User = {
          userId: response.userId, 
          joinedDate: response.joinedDate, 
          username: response.username, 
          email: response.email,
          userProfile: {
            profileId: response.userProfile.profileId, 
            testsCompleted: response.userProfile.testsCompleted, 
            timeSpentTyping: response.userProfile.timeSpentTyping, 
            currentStreak: response.userProfile.currentStreak, 
            selectedTheme: response.userProfile.selectedTheme, 
            hasPremium: response.userProfile.hasPremium, 
            userId: response.userProfile.userId
          }
        };

        this.userStoreService.updateUserStore(user);
        this.localStorageService.saveUserToLocalStorage(user);
        this.loginStatusService.userLoggedIn();

        console.info("Response: ", response);
        this.router.navigate(['/profile']); // Need to include user data inside here?
      })
      .catch(response => {
        alert(`Error while registering: ${response.error.message}`);
      });

      // this.submitUserLoginForm();
  }

  submitUserLoginForm() {
    const userLoginFromForm: UserLogin = this.loginForm.value;
    console.info("Processing user login: ", userLoginFromForm);

    this.userDataService.postUserLogin(userLoginFromForm)
      .then(response => { // Assuming the response is the user data
        const user: User = {
          userId: response.userId, 
          joinedDate: response.joinedDate, 
          username: response.username, 
          email: response.email,
          userProfile: {
            profileId: response.userProfile.profileId, 
            testsCompleted: response.userProfile.testsCompleted, 
            timeSpentTyping: response.userProfile.timeSpentTyping, 
            currentStreak: response.userProfile.currentStreak, 
            selectedTheme: response.userProfile.selectedTheme, 
            hasPremium: response.userProfile.hasPremium, 
            userId: response.userProfile.userId
          }
        };

        this.userStoreService.updateUserStore(user);
        this.localStorageService.saveUserToLocalStorage(user);
        this.loginStatusService.userLoggedIn();

        this.userLocalStore = this.localStorageService.getUserFromLocalStorage();
        // Gets the last chosen theme
        if (this.userLocalStore !== undefined) {
          this.themeService.sendUpdatedTheme(this.userLocalStore?.userProfile.selectedTheme);
        }

        console.info("Response: ", response); // Use this response
        this.router.navigate(['/profile']); // Need to include user data inside here?
      })
      .catch(response => {
        alert(`Error while logging in: ${response.error.message}`);
      })

    
  }

}
