import { Component, inject } from '@angular/core';
import { QuicksettingsService } from '../../quicksettings.service';

@Component({
  selector: 'app-quicksettings',
  templateUrl: './quicksettings.component.html',
  styleUrl: './quicksettings.component.css'
})
export class QuicksettingsComponent {

  private quicksettingsService = inject(QuicksettingsService);

  // Default values.
  selectedTestType: string = "time";
  selectedTestDifficulty: string = "easy";
  selectedTestWordLimit: number = 20; // If test type of word is chosen
  selectedTestTimeLimit: number = 30;


  // Might need to reset certain values after an option is chosen....see how
  // Especially when changing between test types -> the irrelevant value can just change to null or something.
  selectedType(type: string) {
    this.selectedTestType = type;
    this.quicksettingsService.testType(type); // How do i call the setters in the service?
  }

  selectedDifficulty(difficulty: string) {
    this.selectedTestDifficulty = difficulty;
  }

  selectedWordLimit(wordLimit: number) {
    this.selectedTestWordLimit = wordLimit;
  }

  selectedTimeLimit(timeLimit: number) {
    this.selectedTestTimeLimit = timeLimit;
  }

}
