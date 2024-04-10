import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DEFAULT_LOGIN, DEFAULT_REGISTRATION, UserLogin, UserRegistration } from '../../Models/User';
import { UserDataService } from '../../user-data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  private router = inject(Router);
  private formBuilder = inject(FormBuilder);
  private userDataService = inject(UserDataService);
  
  registrationForm!: FormGroup;
  loginForm!: FormGroup;
  
  defaultRegistration: UserRegistration = DEFAULT_REGISTRATION;
  defaultLogin: UserLogin = DEFAULT_LOGIN;

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
        console.info("Response: ", response);
        this.router.navigate([]); // Do something here.... go where? user profile page?
      })
      .catch(response => {
        alert(`Error while registering: ${response.error.message}`);
      });
  }

  submitUserLoginForm() {
    const userLoginFromForm: UserLogin = this.loginForm.value;
    console.info("Processing user login: ", userLoginFromForm);

    this.userDataService.postUserLogin(userLoginFromForm)
      .then(response => {
        console.info("Response: ", response);
        this.router.navigate([]) // Do something here... go where? user profile page too?
      })
      .catch(response => {
        alert(`Error while logging in: ${response.error.message}`);
      })
  }

}
