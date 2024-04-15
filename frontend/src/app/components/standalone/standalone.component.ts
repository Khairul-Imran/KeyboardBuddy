import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { QuicksettingsService } from '../../quicksettings.service';
import { TestgeneratorService } from '../../testgenerator.service';
import { Observable } from 'rxjs';
import { Letter, Word } from '../../Models/Words';
import { TestDataService } from '../../test-data.service';
import { TestData, TypedLetter } from '../../Models/TestData';
import { BaseChartDirective } from 'ng2-charts'; // Added this
import { ChartDataset, ChartOptions } from 'chart.js';
import { CommonModule } from '@angular/common';
import { UserDataService } from '../../user-data.service';
import { UserStoreService } from '../../user-store.service';
import { User } from '../../Models/User';
import { LocalStorageService } from '../../local-storage.service';

@Component({
  standalone: true,
  imports: [BaseChartDirective, CommonModule],
  selector: 'app-standalone',
  templateUrl: './standalone.component.html',
  styleUrl: './standalone.component.css'
})
export class StandaloneComponent implements OnInit {

  private router = inject(Router);
  private testDataService = inject(TestDataService);
  private userDataService = inject(UserDataService);
  private userStoreService = inject(UserStoreService);
  private localStorageService = inject(LocalStorageService);

  wordsFromPreviousTest: Word[] = [];
  testType!: string;
  overallWpm!: any;
  accuracy!: number;
  timeTaken!: number;

  showPreviousTest: boolean = false;

  // Results related properties.
  testData!: TestData;
  userStore!: User; // User and User Profile data
  userHolder!: User;

  // Testing only******
  // typedCharacters!: Letter[];
  typedCharacters!: TypedLetter[];

  chartData!: ChartDataset[];
  chartLabels! : number[]; // x-axis (seconds)
  chartOptions!: ChartOptions;

  ngOnInit(): void {
    this.wordsFromPreviousTest = this.testDataService.getWordsFromPreviousTest();

    // Results
    this.testData = this.testDataService.getCurrentTestData();
    console.info("Results page - Test Data: ", this.testData);
    
    // Testing only
    this.typedCharacters = this.testDataService.getTypedCharacters();

    this.generateChartData();
    this.generateChartLabels();
    this.generateChartOptions();

    // Gets the user store.
    this.userStoreService.user$.subscribe((userFromStore: User) => {
      this.userStore = userFromStore;
      this.localStorageService.saveUserToLocalStorage(userFromStore);
    })

    console.info("USER STORE - ", this.userStore);

    this.userDataService.postTestData(this.testData, this.userStore.userId)
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

    console.info("************");
    console.info("Accessing individual store values:");
    console.info("tests completed - ", this.userStore.userProfile.testsCompleted);
    console.info("time spent typing - ", this.userStore.userProfile.timeSpentTyping);

    
    // Initialise the holder
    this.userHolder = {
      userId: this.userStore.userId, 
      joinedDate: this.userStore.joinedDate, 
      username: this.userStore.username, 
      email: this.userStore.email,
      userProfile: {
        profileId: this.userStore.userProfile.profileId, 
        testsCompleted: this.userStore.userProfile.testsCompleted, 
        timeSpentTyping: this.userStore.userProfile.timeSpentTyping, 
        currentStreak: this.userStore.userProfile.currentStreak, 
        selectedTheme: this.userStore.userProfile.selectedTheme, 
        hasPremium: this.userStore.userProfile.hasPremium, 
        userId: this.userStore.userProfile.userId
      }
    };

    // Update the relevant values for the holder.
    this.userHolder.userProfile.testsCompleted = this.userStore.userProfile.testsCompleted + 1;
    this.userHolder.userProfile.timeSpentTyping = this.userStore.userProfile.timeSpentTyping + this.testData.timeTaken; // Will all tests have a time taken?
    // Do one for streak too.

    // Update the store.
    this.userStoreService.updateUserStore(this.userHolder);
    this.localStorageService.saveUserToLocalStorage(this.userHolder);

    // Update the database (for changes in the User Profile)
    console.info("Saving test data into DB for userId: ", this.userStore.userId);
    console.info("Tests completed: ", this.userHolder.userProfile.testsCompleted);
    console.info("Time spent typing", this.userHolder.userProfile.timeSpentTyping);
    console.info("Current Streak", this.userStore.userProfile.currentStreak);

    this.userDataService.updateUserProfileAfterTest(
      this.userStore.userId, 
      this.userHolder.userProfile.testsCompleted, 
      this.userHolder.userProfile.timeSpentTyping, 
      this.userStore.userProfile.currentStreak)
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

    console.info("Current user store: ", this.userStore);
  }

  
  togglePreviousTest() {
    this.showPreviousTest = !this.showPreviousTest;
  }
  
  generateNewTest() {
    this.testDataService.clearWordsFromPreviousTest();
    this.router.navigate(['/']);
  }


  // Chart
  generateChartData() {
    this.chartData = [
      {
        data: this.testData.secondsData.map(data => data.wordsPerMinute),
        label: "WPM",
        type: 'line',
        yAxisID: 'wpm-axis'
      }, 
      {
        data: this.testData.secondsData.map(data => data.errors),
        label: "Errors",
        type: 'line',
        showLine: false,
        yAxisID: 'errors-axis',
        pointStyle: 'crossRot',
        pointRadius: (hasError) => {
          const errors = hasError.dataset.data[hasError.dataIndex];
          return typeof errors === 'number' && errors > 0 ? 8 : 0;
        },
        pointBorderWidth: 3
      }
    ];
  }

  generateChartOptions() {
    this.chartOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom'
        },
        tooltip: {
          enabled: true
        }
      },
      interaction: {
        mode: 'index',
        intersect: false
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Seconds'
          }
        },
        'errors-axis': {
          title: {
            display: true,
            text: 'Errors Made'
          },
          grid: {
            display: false
          },
          position: 'right',
          ticks: {
            stepSize: 1
          },
          suggestedMax: 5,
          beginAtZero: true
        },
        'wpm-axis': {
          title: {
            display: true,
            text: 'WPM'
          },
          position: 'left',
          beginAtZero: true
        }
      }
    }
  }

  generateChartLabels() {
    this.chartLabels = this.testData.secondsData.map(data => data.second);
  }

}
