import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { TestgeneratorService } from '../../testgenerator.service';
import { Observable, Subscription, map } from 'rxjs';
import { QuicksettingsService } from '../../quicksettings.service';
import { Letter, Word } from '../../Models/Words';

@Component({
  selector: 'app-typing',
  templateUrl: './typing.component.html',
  styleUrl: './typing.component.css'
})
export class TypingComponent implements OnInit, OnDestroy {
  
  private testgeneratorService = inject(TestgeneratorService);
  private quicksettingsService = inject(QuicksettingsService);
  private subscription!: Subscription;
  
  words$!: Observable<Word[]>;
  // wordsP$!: Promise<Word[]>;
  wordsFromObservable: Word[] = [];
  // wordsFromPromise: Word[] = [];
  currentLetterIndex: number = 0;
  currentWordIndex: number = 0;
  // errorMessage!: string; -> didnt use yet.

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

      this.words$.subscribe(words => {
        this.wordsFromObservable = words;
      })
    } else if (this.testType === 'words') {
      // Word-based
      console.log(`Settings: Type=${this.testType}, Difficulty=${this.testDifficulty}, Word Limit=${this.wordLimit}`);
      this.words$ = this.testgeneratorService.getRandomWordsTestLimited(this.testType, this.testDifficulty, this.wordLimit)

      this.words$.subscribe(words => {
        this.wordsFromObservable = words;
      })
    }
  }

  onUserInput(event: Event) {
    const userInput = (event.target as HTMLInputElement).value;
    const currentWord: Word = this.wordsFromObservable[this.currentWordIndex];
    const currentLetter: Letter = currentWord.letters[this.currentLetterIndex];


    // Recall that in the array, the letters are all back-to-back (no spaces)
    // This is different from how the css presents them.
    if (userInput === currentLetter.character) { // Correct letter.
      currentLetter.untouched = false;
      currentLetter.correct = true;
      this.currentLetterIndex++; // Move to the next letter.

      if (this.currentLetterIndex === currentWord.letters.length) { // If all the letters are correct | currentLetterIndex is correct?
        currentWord.fullyCorrect = true;
        this.currentWordIndex++;
        this.currentLetterIndex = 0;
      }
    } else {
      currentLetter.correct = false;
      currentLetter.untouched = false;
    }

    (event.target as HTMLInputElement).value = '';

  }

}
