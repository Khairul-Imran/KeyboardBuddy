import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DEFAULT_LOGIN, DEFAULT_REGISTRATION, DisplayedTestData, PersonalRecords, User, UserLogin, UserProfile, UserRegistration } from '../../Models/User';
import { UserDataService } from '../../user-data.service';
import { UserStoreService } from '../../user-store.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  
  private router = inject(Router);
  private userDataService = inject(UserDataService);
  private userStoreService = inject(UserStoreService);

  // How can i get the userId???? After login, get the userId, and store it in the component store??
  // When logout, clear it?
  userId: number = 0;

  userStore!: User; // User and User Profile data

  user$!: Promise<User>; // TODO!!!!
  userProfile$!: Promise<UserProfile>;
  testData$!: Promise<DisplayedTestData[]>;
  testDataFromPromise!: DisplayedTestData[];
  personalRecords$!: Promise<PersonalRecords[]>;

  timeBasedRecords: PersonalRecords[] = [];
  wordsBasedRecords: PersonalRecords[] = [];
  quotesRecords: PersonalRecords[] = [];
  
  ngOnInit(): void {
    this.userStoreService.user$.subscribe((userFromStore: User) => {
      this.userStore = userFromStore;
    })

    // this.userProfile$ = this.userDataService.getUserProfile(this.userId); -> don't need anymore

    this.testData$ = this.userDataService.getTestData(this.userStore.userId)
      .then(testData => {
        this.testDataFromPromise = testData;
        return this.testDataFromPromise;
      })
      .catch(error => {
        console.error("Error fetching test data: ", error);
        return [];
      });

    if (this.userStore.userProfile.testsCompleted > 0) {
      this.getPersonalRecords();
    }
  }

  getPersonalRecords() {
    this.personalRecords$ = this.userDataService.getPersonalRecords(this.userStore.userId)
      .then(record => {
        record.forEach(test => {
          const [type, ...additionalDetails] = test.testType.split('|');
          switch(type.trim()) {
            case 'words':
              const [wordCount, difficulty] = additionalDetails.map(item => item.trim());
              this.wordsBasedRecords.push({ ...test, difficulty, wordCount});
              break;
            case 'time':
              const [timeLimit, timeDifficulty] = additionalDetails.map(item => item.trim());
              this.timeBasedRecords.push({ ...test, difficulty: timeDifficulty, timeLimit});
              break;
            case 'quote': // No need to edit.
              this.quotesRecords.push(test);
              break;
          }
        });
        return record;
      })
      .catch(error => {
        console.error("Error fetching data: ", error);
        return [];
      })
  }

}
