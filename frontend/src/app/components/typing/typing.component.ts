import { Component, ElementRef, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
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
  // private wordsSubscription!: Subscription;

  @ViewChild('userInputElement') userInputElement!: ElementRef;
  anyMistakeTracker: boolean = false; // To track if even 1 mistake is made for the word.
  
  // words$!: Observable<Word[]>;
  wordsP$!: Promise<Word[]>;
  // wordsFromObservable: Word[] = [];
  wordsFromPromise: Word[] = [];
  currentLetterIndex: number = 0;
  currentWordIndex: number = 0;

  testType!: string;
  testDifficulty!: string;
  testWordLimit!: number;
  testDuration!: number;

  ngOnInit(): void {
    // Receives updated settings from testSettings$ Observable.
    // Generates a new test each time.
    this.subscription = this.quicksettingsService.testSettings$.subscribe(settings => {
      this.testType = settings.testType;
      this.testDifficulty = settings.testDifficulty;
      this.testWordLimit = settings.testWordLimit;
      this.testDuration = settings.testDuration;
      console.log("Settings have changed: \n type: " + 
        this.testType + "\n difficulty: " + 
        this.testDifficulty + "\n word limit: " + 
        this.testWordLimit + "\n time limit: " + 
        this.testDuration);

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
      this.wordsP$ = this.testgeneratorService.getRandomWordsTest(this.testType, this.testDifficulty)
        .then(words => {
          console.info("Words to be inserted: ", words);
          this.wordsFromPromise = words;
          console.info("Words in the array: ", this.wordsFromPromise);
          return this.wordsFromPromise;
        })
        .catch(error => {
          console.error("Error fetching words: ", error);
          return [];
        })

      // this.wordsSubscription = this.words$.subscribe(words => {
      //   this.wordsFromObservable = words;
      // })
      // console.info("These are the words inside the array: ", this.wordsFromPromise);

    } else if (this.testType === 'words') {
      // Word-based
      console.log(`Settings: Type=${this.testType}, Difficulty=${this.testDifficulty}, Word Limit=${this.testWordLimit}`);
      this.wordsP$ = this.testgeneratorService.getRandomWordsTestLimited(this.testType, this.testDifficulty, this.testWordLimit)
        .then(words => {
          console.info("Words to be inserted: ", words);
          this.wordsFromPromise = words;
          console.info("Words in the array: ", this.wordsFromPromise);
          return this.wordsFromPromise;
        })
        .catch(error => {
          console.error("Error fetching words: ", error);
          return [];
        })

      // this.wordsSubscription = this.words$.subscribe(words => {
      //   this.wordsFromObservable = words;
      // })
      // console.info("These are the words inside the array: ", this.wordsFromPromise);
    }

    // Reset the indexes after generating each test.
    this.currentLetterIndex = 0;
    this.currentWordIndex = 0;
    this.userInputElement.nativeElement.focus(); // Sets the focus into the input element.
  }

  onUserInput(event: Event) {
    const userInput = (event.target as HTMLInputElement).value;
    const currentWord: Word = this.wordsFromPromise[this.currentWordIndex];
    const currentLetter: Letter = currentWord.letters[this.currentLetterIndex];

    console.info("Current word before input: ", currentWord);
    console.info("Current letter before input: ", currentLetter);

    if (userInput === currentLetter.character) { // If correct letter.
      currentLetter.untouched = false;
      currentLetter.correct = true;
      this.currentLetterIndex++; // Move to the next letter.
      // currentWord.untouched = false; 
      // -> this would cause issues, with the conditions. 
      // for now, we just take it as - if the word isn't fully gone through yet, it is untouched.
      
    } else { // If wrong letter
      currentLetter.correct = false;
      currentLetter.untouched = false;
      this.anyMistakeTracker = true;
      this.currentLetterIndex++;
      // currentWord.untouched = false;
    }

    // When user inputs the last letter
    // Goes to the next word after you've reached the last letter.
    if (this.currentLetterIndex === currentWord.letters.length) {
      // If there are errors anywhere.
      if (!currentWord.fullyCorrect && this.anyMistakeTracker) {
        currentWord.untouched = false;
      } else {
        // If no errors
        currentWord.fullyCorrect = true;
        currentWord.untouched = false;
      }
      
      this.currentWordIndex++; // Go to the next word.
      this.currentLetterIndex = 0; // Go back to the first letter.
      this.anyMistakeTracker = false;
    }

    (event.target as HTMLInputElement).value = '';
    console.info("Current word after input: ", currentWord);
    console.info("Current letter after input: ", currentLetter);

  }

}
