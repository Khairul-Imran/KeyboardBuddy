import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { TestgeneratorService } from '../../testgenerator.service';
import { Observable, Subscription } from 'rxjs';
import { QuicksettingsService } from '../../quicksettings.service';

@Component({
  selector: 'app-typing',
  templateUrl: './typing.component.html',
  styleUrl: './typing.component.css'
})
export class TypingComponent implements OnInit, OnDestroy {
  
  private testgeneratorService = inject(TestgeneratorService);
  private quicksettingsService = inject(QuicksettingsService);
  private subscription!: Subscription;
  
  words$!: Observable<string[]>;
  wordsP$!: Promise<string[]>;
  errorMessage!: string;

  testType: string = "time"; // time or limited
  testDifficulty: string = "easy"; // easy or hard
  wordLimit: number = 20;
  testDuration: number = 30; // in seconds

  ngOnInit(): void {
    // Receives updated settings from testSettings$ Observable.
    // Generates a new test each time.
    this.subscription = this.quicksettingsService.testSettings$.subscribe(settings => {
      this.testType = settings.testType;
      this.testDifficulty = settings.testDifficulty;
      this.wordLimit = settings.wordLimit;
      this.testDuration = settings.testDuration;

      this.generateNewTest();
    })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  generateNewTest() {
    console.log("Generating new test");

    if (this.testType === 'time') {
      // Time-based
      console.log(`Settings: Type=${this.testType}, Difficulty=${this.testDifficulty}`);
      this.words$ = this.testgeneratorService.getRandomWordsTest(this.testType, this.testDifficulty);
    } else if (this.testType === 'words') {
      // Word-based
      console.log(`Settings: Type=${this.testType}, Difficulty=${this.testDifficulty}, Word Limit=${this.wordLimit}`);
      this.wordsP$ = this.testgeneratorService.getRandomWordsTestLimited(this.testType, this.testDifficulty, this.wordLimit);
    }
  }

}
