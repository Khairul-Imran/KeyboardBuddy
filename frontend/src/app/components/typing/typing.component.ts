import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { TestgeneratorService } from '../../testgenerator.service';
import { Observable, Subscription, map } from 'rxjs';
import { QuicksettingsService } from '../../quicksettings.service';
import { Letter, Word } from '../../Models/Words';

@Component({
  selector: 'app-typing',
  templateUrl: './typing.component.html',
  styleUrl: './typing.component.css'
})
export class TypingComponent implements OnInit, AfterViewInit ,OnDestroy {
  
  private testgeneratorService = inject(TestgeneratorService);
  private quicksettingsService = inject(QuicksettingsService);
  private subscription!: Subscription;
  // private wordsSubscription!: Subscription;
  
  @ViewChild('userInputElement') userInputElement!: ElementRef;
  anyMistakeTracker: boolean = false; // To track if even 1 mistake is made for the word.

  @ViewChild('typingContainerElement') typingContainerElement!: ElementRef;
  caretPosition = 0;
  
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

  ngAfterViewInit(): void {
    this.setUserFocus();
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
    this.caretPosition = 0;
    this.setUserFocus();
  }

  onUserInput(event: Event) {
    const userInput = (event.target as HTMLInputElement).value;
    const currentWord: Word = this.wordsFromPromise[this.currentWordIndex];
    const currentLetter: Letter = currentWord.letters[this.currentLetterIndex];

    console.info("Current word before input: ", currentWord);
    console.info("Current letter before input: ", currentLetter);

    this.updateCaret();
    
    if (userInput === ' ') { // User entered space.
      // Reached the last letter of the word.
      if (this.currentLetterIndex === currentWord.letters.length) {
        // If got errors
        if (!currentWord.fullyCorrect && this.anyMistakeTracker) {
          currentWord.untouched = false;

          // Reset for the next word.
          this.currentWordIndex++;
          this.currentLetterIndex = 0;
          this.anyMistakeTracker = false;
          this.updateCaret();
        } else {
          // If no errors
          currentWord.fullyCorrect = true;
          currentWord.untouched = false;

          // Reset for the next word.
          this.currentWordIndex++;
          this.currentLetterIndex = 0;
          this.anyMistakeTracker = false;
          this.updateCaret();
        }
      }

      // else if not the last letter of the word....
      // TODO

    } else { // User entered a letter.

      if (userInput === currentLetter.character) { // If correct letter.
        currentLetter.untouched = false;
        currentLetter.correct = true;
        this.currentLetterIndex++; // Move to the next letter.
        // currentWord.untouched = false; 
        
      } else if (userInput !== currentLetter.character) { // If wrong letter
        currentLetter.correct = false;
        currentLetter.untouched = false;
        this.anyMistakeTracker = true;
        this.currentLetterIndex++;
        // currentWord.untouched = false;
      }
    }

    (event.target as HTMLInputElement).value = '';
    console.info("Current word after input: ", currentWord);
    console.info("Current letter after input: ", currentLetter);

  }


  // Original
  // onUserInput(event: Event) {
  //   const userInput = (event.target as HTMLInputElement).value;
  //   const currentWord: Word = this.wordsFromPromise[this.currentWordIndex];
  //   const currentLetter: Letter = currentWord.letters[this.currentLetterIndex];

  //   console.info("Current word before input: ", currentWord);
  //   console.info("Current letter before input: ", currentLetter);

  //   this.updateCaret();
    
    
  //   if (userInput === currentLetter.character) { // If correct letter.
  //     currentLetter.untouched = false;
  //     currentLetter.correct = true;
  //     this.currentLetterIndex++; // Move to the next letter.
  //     // currentWord.untouched = false; 
  //     // -> this would cause issues, with the conditions. 
  //     // for now, we just take it as - if the word isn't fully gone through yet, it is untouched.
      
  //   } else if (userInput !== currentLetter.character && userInput !== ' ') { // If wrong letter
  //     currentLetter.correct = false;
  //     currentLetter.untouched = false;
  //     this.anyMistakeTracker = true;
  //     this.currentLetterIndex++;
  //     // currentWord.untouched = false;
  //   }


  //   // When user inputs the last letter
  //   // Goes to the next word after you've reached the last letter.
  //   if (this.currentLetterIndex === currentWord.letters.length) {
  //     // If there are errors anywhere.
  //     if (!currentWord.fullyCorrect && this.anyMistakeTracker) {
  //       currentWord.untouched = false;
  //     } else {
  //       // If no errors
  //       currentWord.fullyCorrect = true;
  //       currentWord.untouched = false;
  //     }
      
  //     this.currentWordIndex++; // Go to the next word.
  //     this.currentLetterIndex = 0; // Go back to the first letter.
  //     this.anyMistakeTracker = false;
  //   }

  //   (event.target as HTMLInputElement).value = '';
  //   console.info("Current word after input: ", currentWord);
  //   console.info("Current letter after input: ", currentLetter);



  //   // TODO: If user presses backspace.

  //   // TODO: Fix issue with trailing spaces carrying over to the next test.
  //   // TODO: Set a limit to how far the user can type, especially for word-limit test.

  // }

  setUserFocus() {
    if (this.userInputElement) {
      this.userInputElement.nativeElement.focus();
    }
  }

  updateCaret() {
    const currentWord = this.typingContainerElement.nativeElement.children[this.currentWordIndex];

    if (currentWord) { // If there is a current word
      // If we are at the last letter of the word
      if (this.currentLetterIndex === currentWord.children.length - 1) { 
        const nextWord = this.typingContainerElement.nativeElement.children[this.currentWordIndex + 1];
        if (nextWord) { // If there is a next word
          this.caretPosition = nextWord.offsetLeft;
        }
      } else {
        // If we are not at the last letter
        const letter = currentWord.children[this.currentLetterIndex];
        if (letter) {
          this.caretPosition = letter.offsetLeft + letter.offsetWidth;
        }
      }
    }
  }

}
