import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { QuicksettingsService } from '../../quicksettings.service';
import { TestgeneratorService } from '../../testgenerator.service';
import { Observable } from 'rxjs';
import { Word } from '../../Models/Words';
import { TestDataService } from '../../test-data.service';
import { TestData } from '../../Models/TestData';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrl: './results.component.css'
})
export class ResultsComponent implements OnInit {
  
  private router = inject(Router);
  private testDataService = inject(TestDataService);
  
  wordsFromPreviousTest: Word[] = [];
  testType!: string;
  overallWpm!: any;
  accuracy!: number;
  timeTaken!: number;

  showPreviousTest: boolean = false;

  // Results related properties.
  testData!: TestData[];
  

  ngOnInit(): void {
    this.wordsFromPreviousTest = this.testDataService.getWordsFromPreviousTest();
    // Results
    this.testType = this.testDataService.getTestType();
    this.overallWpm = this.testDataService.getOverallWpm();
    this.accuracy = this.testDataService.getAccuracy();
    if (this.testType.includes('words')) {
      this.timeTaken = this.testDataService.getTimeTaken();
    }
  }

  
  togglePreviousTest() {
    this.showPreviousTest = !this.showPreviousTest;
  }
  
  generateNewTest() {
    this.testDataService.clearWordsFromPreviousTest();
    this.router.navigate(['/']);
  }

}
