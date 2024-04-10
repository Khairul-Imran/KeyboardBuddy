import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DEFAULT_LOGIN, DEFAULT_REGISTRATION, DisplayedTestData, PersonalRecords, UserLogin, UserProfile, UserRegistration } from '../../Models/User';
import { UserDataService } from '../../user-data.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  
  private router = inject(Router);
  private userDataService = inject(UserDataService);

  // How can i get the userId????
  userId: number = 0;

  userProfile$!: Promise<UserProfile>;
  testData$!: Promise<DisplayedTestData[]>;
  personalRecords$!: Promise<PersonalRecords[]>;
  
  ngOnInit(): void {
    this.userProfile$ = this.userDataService.getUserProfile(this.userId);
    this.testData$ = this.userDataService.getTestData(this.userId);
    this.personalRecords$ = this.userDataService.getPersonalRecords(this.userId);
  }


}
