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
  showPreviousTest: boolean = false;

  // Results related properties.
  testData!: TestData[];
  

  ngOnInit(): void {
    this.wordsFromPreviousTest = this.testDataService.getWordsFromPreviousTest();
  }

  
  togglePreviousTest() {
    this.showPreviousTest = !this.showPreviousTest;
  }
  
  generateNewTest() {
    this.testDataService.clearWordsFromPreviousTest();
    this.router.navigate(['/']);
  }

}
