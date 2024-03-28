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
  // To have a mistake counter too, to keep track of total errors?

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
    this.anyMistakeTracker = false; // To prevent any mistakes from carrying over to next test (if user didn't press space)
    this.setUserFocus();
  }

  onUserInput(event: Event) {
    const userInput = (event.target as HTMLInputElement).value;
    const currentWord: Word = this.wordsFromPromise[this.currentWordIndex];
    const currentLetter: Letter = currentWord.letters[this.currentLetterIndex];
    const TRAILING_LETTERS_LIMIT = 6;

    console.info("Current word before input: ", currentWord);
    console.info("Current letter before input: ", currentLetter);

    this.updateCaret();
    
    if (userInput === ' ') { // ****User entered space.****
      // Reached the last letter of the word. >= to include the trailing letters.
      if (this.currentLetterIndex >= currentWord.letters.length) {
        // If got errors
        if (!currentWord.fullyCorrect && this.anyMistakeTracker || currentWord.trailingLetters.length > 0) {
          currentWord.untouched = false;
          // currentWord.fullyCorrect = false;

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

      // else if pressed space while not at the last letter of the word....
      // TODO

    } else if (/^[a-zA-Z]$/.test(userInput)) { // ****User entered a letter.****

      // If within a current word
      if (this.currentLetterIndex < currentWord.letters.length) { // <=
        
        if (userInput === currentLetter.character ) { // If correct letter.
          currentLetter.untouched = false;
          currentLetter.correct = true;
          this.currentLetterIndex++;
          // currentWord.untouched = false; 
          
        } else if (userInput !== currentLetter.character) { // If wrong letter
          currentLetter.untouched = false;
          currentLetter.correct = false;
          this.anyMistakeTracker = true;
          this.currentLetterIndex++;
          // currentWord.untouched = false; 
        }

      // If outside of current word (i.e. trailing letters)
      } else if (currentWord.trailingLetters.length < TRAILING_LETTERS_LIMIT) { 
        const trailingLetter: Letter = {
          character: userInput,
          correct: false,
          untouched: false
        };
        currentWord.trailingLetters.push(trailingLetter); // Adds the trailing letter to the word.
        currentWord.fullyCorrect = false;
        this.currentLetterIndex++;
      }

      this.updateCaret();
    }

    (event.target as HTMLInputElement).value = '';
    console.info("Current word after input: ", currentWord);
    console.info("Current letter after input: ", currentLetter);

    // TODO: If user presses backspace.
    // -> backspace to amend mistakes. Need to keep track of this too technically?

    // TODO: Fix issue with trailing spaces carrying over to the next test.
    // TODO: Set a limit to how far the user can type, especially for word-limit test.

  }

  setUserFocus() {
    if (this.userInputElement) {
      this.userInputElement.nativeElement.focus();
    }
  }

  updateCaret() {
    const currentWord = this.typingContainerElement.nativeElement.children[this.currentWordIndex];

    if (currentWord) { // If there is a current word
      // At the beginning of a word
      if (this.currentLetterIndex === 0) {
        const space = currentWord.previousSibling;
        if (space === ' ') {
          this.caretPosition = currentWord.offsetLeft - space.offsetWidth;
        } else {
          this.caretPosition = currentWord.offsetLeft;
        }
      }
      // If we are inside the word or at the last letter of the word
      if (this.currentLetterIndex <= currentWord.children.length - 1) { 

        // const nextWord = this.typingContainerElement.nativeElement.children[this.currentWordIndex + 1];
        const letter = currentWord.children[this.currentLetterIndex - 1];

        if (letter) { // If there is a next word
          this.caretPosition = letter.offsetLeft + letter.offsetWidth;
          // this.caretPosition = nextWord.offsetLeft;
        }

      // If at the trailing letters
      } else if (this.currentLetterIndex > currentWord.children.length - 1) { 
        const trailingLetterIndex = this.currentLetterIndex - currentWord.children.length;
        // const trailingLetters = Array.from(currentWord.children).slice(currentWord.children.length - 1);
        const trailingLetter = currentWord.children[currentWord.children.length - 1 + trailingLetterIndex];
        // If there are trailing letters present
        if (trailingLetter) {
          // const lastTrailingLetter = trailingLetters[trailingLetters.length - 1] as HTMLElement;
          this.caretPosition = trailingLetter.offsetLeft + trailingLetter.offsetWidth;
        } else {
          this.caretPosition = currentWord.offsetLeft + currentWord.offsetWidth;
        }



        // const letter = currentWord.children[this.currentLetterIndex];
        // if (letter) {
        //   this.caretPosition = letter.offsetLeft + letter.offsetWidth;
        // }
      }
    }
  }

}
