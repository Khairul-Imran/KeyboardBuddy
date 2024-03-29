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
  currentLetterIndex: number = 0; // *****Testing -1 Value******
  currentTrailingLetterIndex: number = 0;
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
    this.currentTrailingLetterIndex = 0; // Added
    this.currentWordIndex = 0;
    this.caretPosition = 0;
    this.anyMistakeTracker = false; // To prevent any mistakes from carrying over to next test (if user didn't press space)

    this.setUserFocus();
  }

  onUserInput(event: KeyboardEvent) {
    // const userInput = (event.target as HTMLInputElement).value;
    const userInput = event.key;
    const currentWord: Word = this.wordsFromPromise[this.currentWordIndex];
    const currentLetter: Letter = currentWord.letters[this.currentLetterIndex]; // This doesn't track trailing letters
    // const currentTrailingLetter: Letter = currentWord.trailingLetters[this.currentTrailingLetterIndex];
    // const previousWord: Word = this.wordsFromPromise[this.currentWordIndex - 1];
    const TRAILING_LETTERS_LIMIT = 6;

    // console.info("Current word before input: ", currentWord);
    // console.info("Current letter before input: ", currentLetter);

    this.updateCaret();
    

    if (userInput === ' ') { // ****User entered space.****
      // Reached the last letter of the word. >= to include the trailing letters.
      if (this.currentLetterIndex === currentWord.letters.length - 1 && !currentLetter.untouched) {

        console.info("Before space - current letter index: ", this.currentLetterIndex);
        console.info("Before space - current word length: ", currentWord.letters.length - 1);


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
        console.info("Current letter: ", currentLetter);
        console.info("Current index before input: ", this.currentLetterIndex);
        console.info("User input: ", userInput);
        
        if (userInput === currentLetter.character) { // If correct letter.
          console.info("Current letter after input: ", currentLetter);
          currentLetter.untouched = false;
          currentLetter.correct = true;

          // I think the currentLetter variable is updated only when the method is called again, hence the inconsistency.
          if (this.currentLetterIndex != currentWord.letters.length - 1) { // ******* -1 to ensure it doesn't go out of bounds*****
            this.currentLetterIndex++;
            // currentWord.fullyCorrect = true;
            console.info("Current index: ", this.currentLetterIndex);
          }
          
        } else if (userInput !== currentLetter.character) { // If wrong letter
          currentLetter.untouched = false;
          currentLetter.correct = false;
          this.anyMistakeTracker = true;
          // this.currentLetterIndex++;

          if (this.currentLetterIndex != currentWord.letters.length - 1) { // ******* -1 to ensure it doesn't go out of bounds*****
            this.currentLetterIndex++;
            console.info("Current index: ", this.currentLetterIndex);
          }

        }

      // If outside of current word (i.e. trailing letters)
      } else if (this.currentLetterIndex >= currentWord.letters.length && currentWord.trailingLetters.length < TRAILING_LETTERS_LIMIT) { 
        const trailingLetter: Letter = {
          character: userInput,
          correct: false,
          untouched: false
        };
        currentWord.trailingLetters.push(trailingLetter); // Adds the trailing letter to the word.
        currentWord.fullyCorrect = false;
        this.currentLetterIndex++;
        console.info("Current letter (trailing): ", currentWord.trailingLetters[this.currentTrailingLetterIndex].character);
        console.info("Current overall letter: ", currentLetter);
        this.currentTrailingLetterIndex++;
      }

      this.updateCaret();
    }




    
    else if (userInput === 'Backspace') { // ****User pressed backspace.****
      console.info("Before backspace - current index: ", this.currentLetterIndex);
      console.info("Before backspace - current letter: ", currentLetter);

      // For deleting within current word.
      if (this.currentLetterIndex > 0 && currentWord.trailingLetters.length === 0) {
        this.currentLetterIndex--; // (incase)
        console.info("After backspace - current letter: ", currentLetter);
        currentLetter.correct = false;
        currentLetter.untouched = true;
        this.anyMistakeTracker = false;

      }

      // // Deleting current word's trailing letters
      // if (currentWord.trailingLetters.length > 0) {
      //   currentWord.trailingLetters.pop();
      //   this.currentLetterIndex--;
      // }


      // // Deleting previous word (if has errors)
      // if (this.currentWordIndex > 0 && this.currentLetterIndex === 0 && !previousWord.fullyCorrect) {
      //   if (previousWord.trailingLetters.length === 0) { // No trailing
      //     const previousWordBeforeChange = previousWord;
      //     this.currentWordIndex--;
      //     // currentWord.untouched = false;
      //     this.currentLetterIndex = previousWordBeforeChange.letters.length;
      //   }

      //   if (previousWord.trailingLetters.length > 0) { // Has trailing
      //     const previousWordBeforeChange = previousWord;
      //     this.currentWordIndex--;
      //     // currentWord.untouched = false;
      //     this.currentLetterIndex = previousWordBeforeChange.letters.length + previousWordBeforeChange.trailingLetters.length;
      //   }
      // }

    }


    this.updateCaret();
    (event.target as HTMLInputElement).value = '';
    // console.info("Current word after input: ", currentWord);
    // console.info("Current letter (trailing): ", currentTrailingLetter);

    // TODO: If user presses backspace.
    // -> backspace to amend mistakes. Need to keep track of this too technically?

    // TODO: Fix issue with trailing spaces carrying over to the next test. (i think this is solved already)
    // TODO: Set a limit to how far the user can type, especially for word-limit test.
  }


  setUserFocus() {
    if (this.userInputElement) {
      this.userInputElement.nativeElement.focus();
    }
  }


  // TODO: to update the variable names
  // TODO: to update for trailing letter index
  updateCaret() {
    const currentWord = this.wordsFromPromise[this.currentWordIndex];
    const wordElement = this.typingContainerElement.nativeElement.children[this.currentWordIndex];

    if (wordElement) { // Word element exists

      if (this.currentLetterIndex === 0) {
        this.caretPosition = wordElement.offsetLeft;


      } else if (this.currentLetterIndex <= currentWord.letters.length) { // If caret is at the beginning or inside the word.
        const letterElement = wordElement.children[this.currentLetterIndex - 1];
        if (letterElement) {
          this.caretPosition = letterElement.offsetLeft + letterElement.offsetWidth;
          // console.log("Caret is at the beginning or inside!")
        }

      } else { // Caret is at the end.

        // If there are trailing letters.
        if (currentWord.trailingLetters.length > 0) {

          const trailingLetterIndex = this.currentLetterIndex - currentWord.letters.length;
          const trailingLetterElement = wordElement.children[currentWord.letters.length + trailingLetterIndex - 1];
          if (trailingLetterElement) {
            this.caretPosition = trailingLetterElement.offsetLeft + trailingLetterElement.offsetWidth;
            // console.log("Caret is inside a trailing letter!")
          }

        } else if (currentWord.trailingLetters.length === 0) { // No trailing letters.
          const lastLetterElement = wordElement.children[currentWord.letters.length - 1];
          if (lastLetterElement) {
            this.caretPosition = lastLetterElement.offsetLeft + lastLetterElement.offsetWidth;
            // console.log("Caret is at the end of a word!")
          }
        }

      }
    }
  }

}
