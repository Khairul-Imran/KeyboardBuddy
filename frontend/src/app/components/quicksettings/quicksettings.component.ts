import { Component, OnInit, inject } from '@angular/core';
import { QuicksettingsService } from '../../quicksettings.service';
import { TestgeneratorService } from '../../testgenerator.service';

@Component({
  selector: 'app-quicksettings',
  templateUrl: './quicksettings.component.html',
  styleUrl: './quicksettings.component.css'
})
export class QuicksettingsComponent implements OnInit {
  
  private quicksettingsService = inject(QuicksettingsService);
  private testGeneratorService = inject(TestgeneratorService);
  

  selectedTestType!: string;
  selectedTestDifficulty!: string;
  selectedTestWordLimit: number = 20;
  selectedTestDuration: number = 30;
  
  ngOnInit(): void {
    // Initial settings oninit. Time test on easy by default. No need for word limit in this case.
    // this.quicksettingsService.testType = this.selectedTestType;
    // this.quicksettingsService.testDifficulty = this.selectedTestDifficulty;
    // this.quicksettingsService.wordLimit = this.selectedTestWordLimit;
    // this.quicksettingsService.testDuration = this.selectedTestTimeLimit;

    this.selectedTestType = this.quicksettingsService.testType;
    this.selectedTestDifficulty = this.quicksettingsService.testDifficulty;
    this.selectedTestDuration = this.quicksettingsService.testDuration;
    this.selectedTestWordLimit = this.quicksettingsService.testWordLimit;
  }

  // Might need to reset certain values after an option is chosen....see how
  // Especially when changing between test types -> the irrelevant value can just change to null or something.
  selectedType(type: string) {
    if (type !== this.selectedTestType) {
      this.selectedTestType = type;
      this.quicksettingsService.testType = type; // Setter
  
      // Setting the defaults whenever type of test changes. -> Not using this anymore, just let the previous values stand.
      // if (type === 'words') {
      //   this.selectedTestWordLimit = 20;
      //   this.quicksettingsService.wordLimit = 20;
      // } else if (type === 'time') {
      //   this.selectedTestTimeLimit = 30;
      //   this.quicksettingsService.testDuration = 30;
      // }
      // console.info("Selected type has changed to: ", this.selectedTestType);
    }
  }

  selectedDifficulty(difficulty: string) {
    if (difficulty !== this.selectedTestDifficulty) {
      this.selectedTestDifficulty = difficulty;
      this.quicksettingsService.testDifficulty = difficulty; // Setter
    }
  }

  selectedWordLimit(wordLimit: number) {
    if (wordLimit !== this.selectedTestWordLimit) {
      this.selectedTestWordLimit = wordLimit;
      this.quicksettingsService.testWordLimit = wordLimit; // Setter
    }
  }

  selectedTimeLimit(timeLimit: number) {
    if (timeLimit !== this.selectedTestDuration) {
      this.selectedTestDuration = timeLimit;
      this.quicksettingsService.testDuration = timeLimit; // Setter
    }
  }
}
