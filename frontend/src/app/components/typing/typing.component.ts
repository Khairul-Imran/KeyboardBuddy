import { AfterViewInit, Component, ElementRef, OnChanges, OnDestroy, OnInit, QueryList, SimpleChanges, ViewChild, ViewChildren, inject } from '@angular/core';
import { TestgeneratorService } from '../../testgenerator.service';
import { Observable, Subscription, last, map } from 'rxjs';
import { QuicksettingsService } from '../../quicksettings.service';
import { Letter, Word } from '../../Models/Words';
import { Router } from '@angular/router';
import { TestDataService } from '../../test-data.service';
import { SecondsData, TestData, TypedLetter } from '../../Models/TestData';

@Component({
  selector: 'app-typing',
  templateUrl: './typing.component.html',
  styleUrl: './typing.component.css'
})
export class TypingComponent implements OnInit, AfterViewInit ,OnDestroy {
  
  private router = inject(Router);
  private testgeneratorService = inject(TestgeneratorService);
  private quicksettingsService = inject(QuicksettingsService);
  private testDataService = inject(TestDataService);
  private subscription!: Subscription;
  // private wordsSubscription!: Subscription;
  
  @ViewChild('userInputElement') userInputElement!: ElementRef;
  anyMistakeTracker: boolean = false; // To track if even 1 mistake is made for the word.
  // To have a mistake counter too, to keep track of total errors?
  @ViewChild('typingContainerElement') typingContainerElement!: ElementRef;

  caretPosition = 0;
  
  wordsP$!: Promise<Word[]>;
  wordsFromPromise: Word[] = [];
  authorForQuote!: string;

  // ------------------------ New ------------------------
  
  visibleWords: number = 0; // Newly added 7 Apr

  // ------------------------ New ------------------------

  // To be received from the service.
  wordsFromPreviousTest: Word[] = [];


  // ------------------------ Results related properties ------------------------
  // testData!: TestData[];


  // ------------------------ Results related properties ------------------------


  // ---------------------------- Countdown ----------------------------

  
  // ngOnInit(): void {
  //   this.subscription = this.quicksettingsService.countDown$.subscribe(testDuration => {
  //     this.duration = testDuration;
  //     this.remainingTime = testDuration;
  //   });
  // }
  
  // startTimer() {
    
  // }
  
  // stopTimer() {
    
  // }

  // ---------------------------- Countdown ----------------------------
  

  currentLetterIndex: number = 0;
  currentWordIndex: number = 0;
  testFinished: boolean = false; // New Apr 1
  
  testType!: string;
  testDifficulty!: string;
  testWordLimit!: number;
  testDuration!: number;
  
  ngOnInit(): void {
    // this.wordsFromPreviousTest = this.testDataService.getWordsFromPreviousTest();
    // if (this.wordsFromPreviousTest) { // If exists.
    //   console.info("Words from previous test have been received!", this.wordsFromPreviousTest);
    //   this.wordsFromPromise = this.wordsFromPreviousTest;
    //   // Might need to clear the words from the service in case, see how

    // } 
  
    // Receives updated settings from testSettings$ Observable.
    // Generates a new test each time.
    this.subscription = this.quicksettingsService.testSettings$.subscribe(settings => {
      this.testType = settings.testType;
      this.testDifficulty = settings.testDifficulty;
      this.testWordLimit = settings.testWordLimit;
      this.testDuration = settings.testDuration; // For countdown too.

      console.log("Settings have changed: \n type: " + 
        this.testType + "\n difficulty: " + 
        this.testDifficulty + "\n word limit: " + 
        this.testWordLimit + "\n time limit: " + 
        this.testDuration
      );
      
      this.generateNewTest();
    })

    this.remainingTime = this.testDuration; // Countdown
  }
  
  ngAfterViewInit(): void {
    this.setUserFocus();
  }
  
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    // Countdown.
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
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

          this.updateVisibility(); // Initial words to be displayed.

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
    } else if (this.testType === 'quote') {
      // Quote-based
      console.log(`Settings: Type=${this.testType}, Difficulty=${this.testDifficulty}, Word Limit=${this.testWordLimit}`);
      this.wordsP$ = this.testgeneratorService.getQuoteTest()
        .then(words => {
          console.info("Words to be inserted: ", words.sentence);
          this.wordsFromPromise = words.sentence;
          this.authorForQuote = words.author;
          console.info("Words in the array: ", this.wordsFromPromise);
          console.info("Author of quote: ", this.authorForQuote);
          return this.wordsFromPromise;
        })
        .catch(error => {
          console.error("Error fetching words: ", error);
          return [];
        })

    }

    // Reset the indexes after generating each test.
    this.currentLetterIndex = 0;
    this.currentWordIndex = 0;
    this.caretPosition = 0;
    this.anyMistakeTracker = false; // To prevent any mistakes from carrying over to next test (if user didn't press space)
    this.testFinished = false; // New Apr 1

    this.stopTimer() // Stop timer if you reset the test.
    this.elapsedTime = 0;
    this.secondsData = [];
    this.typedCharacters = [];

    clearInterval(this.countdownInterval); // For countdown
    this.remainingTime = this.testDuration // For countdown
    this.setUserFocus();
  }

  // ------------------------ New ------------------------

  updateVisibility() {
    console.info("Length of wordsFromPromise: ", this.wordsFromPromise.length);
    this.visibleWords = Math.floor(this.wordsFromPromise.length * 0.25); // Calculating words to be visible at the beginning.
    console.info("Number of words to be visible: ", this.visibleWords);
  }

  // Activated after each VALID (at the end of a word) spacebar
  afterWordTyped() {
    let typedWords: number = 0;

    for (let word of this.wordsFromPromise) {
      if (!word.untouched) {
        typedWords++;
      }
    }

    if (typedWords >= this.visibleWords * 0.6) { // After typedWords reaches a certain point
      const nextMilestone = Math.min(Math.ceil((this.visibleWords + 1) / this.wordsFromPromise.length * 4) * 25, 100);
      // const nextMilestone = Math.min((this.visibleWords + 25), 100);

      this.visibleWords = Math.floor(this.wordsFromPromise.length * (nextMilestone / 100));
    }
  }


  // ------------------------ New ------------------------

  onUserInput(event: KeyboardEvent) {
    // const userInput = (event.target as HTMLInputElement).value;
    const userInput = event.key;

    // Starting condition
    // When any letter has been pressed
    if (/^[a-zA-Z]$/.test(userInput) && this.currentLetterIndex === 0 && this.currentWordIndex === 0){
      this.startTypingTest();
    }


    // ------------------------ Insert Finishing Conditions here ------------------------

    // if (userInput === ' ' && this.currentWordIndex === this.wordsFromPromise.length - 1) { // If at the last word
    //   if (this.currentLetterIndex === this.wordsFromPromise[this.currentWordIndex].letters.length - 1 && 
    //     this.wordsFromPromise[this.currentWordIndex].letters[this.currentLetterIndex].untouched === false) { // If last word has been typed
          
    //       // If the last word is wrong -> underline
    //       this.wordsFromPromise[this.currentWordIndex].fullyCorrect = false;
    //       this.wordsFromPromise[this.currentWordIndex].untouched = false;
    
    //       this.testFinished = true;
    //       console.info("You have finished the test: ", this.testFinished);
    //       console.log("YOU HAVE FINISHED THE TEST!!!! YAYYYYYYYYY");
    
    //       this.endTypingTest();// Added this 3 apr
    
    //       this.goToResultsComponent(); // Added this
    //       return;
    //   }
    // }
    // ------------------------Insert Finishing Conditions here------------------------


    const currentWord: Word = this.wordsFromPromise[this.currentWordIndex];
    const currentLetter: Letter = currentWord.letters[this.currentLetterIndex];

    this.updateCaret();
    

    if (userInput === ' ') { // **** User entered space ****
      // Reached the last letter of the word.
      if (this.currentLetterIndex === currentWord.letters.length - 1 && !currentLetter.untouched) {

        // console.info("Before space - current letter index: ", this.currentLetterIndex);
        // console.info("Before space - current word length: ", currentWord.letters.length - 1);


        // If got errors
        if (!currentWord.fullyCorrect && this.anyMistakeTracker) {
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

          this.afterWordTyped(); // ************************ Added this ************************

          // Reset for the next word.
          this.currentWordIndex++;
          this.currentLetterIndex = 0;
          this.anyMistakeTracker = false;
          this.updateCaret();
        }
      }


      // Final check for correctness
      if (this.hasFalseLetter(currentWord) === false) {
        this.anyMistakeTracker = false;
        currentWord.fullyCorrect = true;
        console.log("It has been determined that your word is correct!!!")
      } else if (this.hasFalseLetter(currentWord) === true) {
        currentWord.fullyCorrect = false;
        currentWord.untouched = false;
        console.log("It has been determined that your word is false!!!")
      }

    } else if (/^[a-zA-Z]$/.test(userInput)) { // **** User entered a letter ****

      // If within a current word
      if (this.currentLetterIndex < currentWord.letters.length - 1) { // <= added the -1 today apr 1 **************
        // console.info("Current letter: ", currentLetter);
        console.info("Current index before input: ", this.currentLetterIndex);
        // console.info("User input: ", userInput);
        
        if (userInput === currentLetter.character) { // If correct letter.
          // console.info("Current letter after input: ", currentLetter);
          currentLetter.untouched = false;
          currentLetter.correct = true;
          // this.typedCharacters.push(currentLetter); // Just added 3 apr
          this.typedCharacters.push({ character: currentLetter.character, correct: currentLetter.correct, second: this.elapsedTime});

          // If not last letter.
          if (this.currentLetterIndex != currentWord.letters.length - 1) { // ******* -1 to ensure it doesn't go out of bounds*****
            this.currentLetterIndex++;
            // currentWord.fullyCorrect = true;
            console.info("Current index: ", this.currentLetterIndex);
          }
          
        } else if (userInput !== currentLetter.character) { // If wrong letter
          currentLetter.untouched = false;
          currentLetter.correct = false;
          this.anyMistakeTracker = true;
          // this.typedCharacters.push(currentLetter); // Just added 3 apr
          this.typedCharacters.push({ character: currentLetter.character, correct: currentLetter.correct, second: this.elapsedTime});

          // If not last letter.
          if (this.currentLetterIndex != currentWord.letters.length - 1) { // ******* -1 to ensure it doesn't go out of bounds*****
            this.currentLetterIndex++;
            console.info("Current index: ", this.currentLetterIndex);
          }

        }
      } 
      
      // **** For last letters ****
      else if (this.currentLetterIndex === currentWord.letters.length - 1 && currentWord.letters[this.currentLetterIndex].untouched === true) {
        // at the last letter, and has NOT been touched.
        // console.info("Current index: ", this.currentLetterIndex);
        // console.log("You are at the last letter, and it has NOT been touched!!!")
        
        // Remember, no need to increment in this case as it is the last character.
        if (userInput === currentLetter.character) {
          currentLetter.untouched = false;
          currentLetter.correct = true;
          // this.typedCharacters.push(currentLetter); // Just added 3 apr
          this.typedCharacters.push({ character: currentLetter.character, correct: currentLetter.correct, second: this.elapsedTime});

          // -------------------------- Finishing condition - if last word is correct / wrong --------------------------

          if (this.isLastWord(currentWord)) {
            if (this.hasFalseLetter(currentWord) === false) { // Last word is correct && Last letter correct
              currentWord.fullyCorrect = true;

              console.info("You have finished the test: ", this.testFinished);
              console.log("YOU HAVE FINISHED THE TEST!!!! YAYYYYYYYYY");
              
              this.testFinished = true;
              this.updateCaret();
              this.endTypingTest();
              this.goToResultsComponent();
              return;

            } else { // Last word is wrong && Last letter correct
              currentWord.fullyCorrect = false;
              currentWord.untouched = false;

              console.info("You have finished the test: ", this.testFinished);
              console.log("YOU HAVE FINISHED THE TEST!!!! YAYYYYYYYYY");
                
              this.testFinished = true;
              this.updateCaret();
              this.endTypingTest();
              this.goToResultsComponent();
              return;
            }
          }

          // -------------------------- Finishing condition - if last word is correct / wrong --------------------------

        } else {
          currentLetter.untouched = false;
          currentLetter.correct = false;
          this.anyMistakeTracker = true;
          console.log("Hey, you have a mistake here!!!!!!!!")
          // this.typedCharacters.push(currentLetter); // Just added 3 apr
          this.typedCharacters.push({ character: currentLetter.character, correct: currentLetter.correct, second: this.elapsedTime});

          // -------------------------- Finishing condition - if last word is wrong && last letter wrong--------------------------
        
          if (this.isLastWord(currentWord)) {
            if (this.hasFalseLetter(currentWord) === true) { // Last word is false.
              currentWord.fullyCorrect = false;
              currentWord.untouched = false;

              console.info("You have finished the test: ", this.testFinished);
              console.log("YOU HAVE FINISHED THE TEST!!!! YAYYYYYYYYY");
                
              this.testFinished = true;
              this.updateCaret();
              this.endTypingTest();
              this.goToResultsComponent();
              return;
            }
          }

          // -------------------------- Finishing condition - if last word is wrong && last letter wrong --------------------------
        }
      }
      
      else if (this.currentLetterIndex === currentWord.letters.length - 1 && currentWord.letters[this.currentLetterIndex].untouched === false) {
        // at the last letter, and has been touched.
        console.info("Current index: ", this.currentLetterIndex);
        console.log("You are at the last letter, and it has been touched!!!")

        // Do nothing
      }

      this.updateCaret();
    }

    else if (userInput === 'Backspace') { // ****User pressed backspace.****
      console.info("Before backspace - current index: ", this.currentLetterIndex);
      console.info("Before backspace - current letter: ", currentLetter);

      // Ensures you don't go out of bounds
      if (this.currentLetterIndex > 0) {

        // Determining which situation it is:
        // Current letter has been touched? (i.e you had reached the end of the word, and want to go back) or
        // Current letter has NOT been touched? (i.e you have not reached the end, the letter you are at is still untouched)
        if (currentWord.letters[this.currentLetterIndex].untouched === true) {
          // If current letter is UNTOUCHED -> You want to delete the previous letter
          console.info("Backspace - Current letter: ", currentWord.letters[this.currentLetterIndex]);
          this.currentLetterIndex--;
          // Previous letter
          const previousLetter: Letter = this.wordsFromPromise[this.currentWordIndex].letters[this.currentLetterIndex]; // Need to -1?
          previousLetter.correct = false;
          previousLetter.untouched = true;
          console.info("Backspace - Current letter: ", previousLetter);

          this.typedCharacters.pop(); // Just added 3 apr

          // currentLetter.correct = false;
          // currentLetter.untouched = true;
          // this.currentLetterIndex--;
        }
        
        else if (currentWord.letters[this.currentLetterIndex].untouched === false) {
          // If current letter is TOUCHED (last letter touched) -> You want to delete the current letter first
          currentWord.letters[this.currentLetterIndex].correct = false;
          currentWord.letters[this.currentLetterIndex].untouched = true;
          this.typedCharacters.pop(); // Just added 3 apr
        } 
        
        
        else {
          // currentLetter.correct = false;
          // currentLetter.untouched = true;
          currentWord.letters[this.currentLetterIndex].correct = false;
          currentWord.letters[this.currentLetterIndex].untouched = true;
          this.currentLetterIndex--;

          this.typedCharacters.pop(); // Just added 3 apr
        }
        
      } else if (this.currentLetterIndex === 0) { // For when you are at the first letter

        // For if there are mistakes in the previous word ONLY
        // ------------------------------New Apr 1--------------------
        const previousWord: Word = this.wordsFromPromise[this.currentWordIndex - 1];
        
        if (this.hasFalseLetter(previousWord) === true) {
          this.currentWordIndex--; // Setting current word
          this.currentLetterIndex = previousWord.letters.length - 1;
          // currentWord.untouched = false;
          console.log("You have just move back one word!!!!")
        }
        // ------------------------------New Apr 1--------------------

        currentLetter.correct = false;
        currentLetter.untouched = true;

        this.typedCharacters.pop(); // Just added 3 apr

        // currentWord.letters[this.currentLetterIndex].correct = false;
        // currentWord.letters[this.currentLetterIndex].untouched = true;
      }

      
      // ****Helps confirm that the entire word is correct****
      if (this.hasFalseLetter(currentWord) === false) {
        this.anyMistakeTracker = false;
      }
      
      // console.info("After backspace - current letter: ", currentLetter);
    }


    this.updateCaret();



    (event.target as HTMLInputElement).value = '';

    // TODO: Set a limit to how far the user can type, especially for word-limit test.
  }


  setUserFocus() {
    if (this.userInputElement) {
      this.userInputElement.nativeElement.focus();
    }
  }


  updateCaret() {
    const currentWord = this.wordsFromPromise[this.currentWordIndex];
    const currentLetter: Letter = currentWord.letters[this.currentLetterIndex];
    const wordElement = this.typingContainerElement.nativeElement.children[this.currentWordIndex];

    if (wordElement) { // Word element exists

      if (this.currentLetterIndex === 0) { // Caret at the first letter.
        this.caretPosition = wordElement.offsetLeft;
      }
      
      else if (this.currentLetterIndex <= currentWord.letters.length - 1) { // If index is inside the word. (not last letter)

        const letterElement = wordElement.children[this.currentLetterIndex - 1];
        if (letterElement) {
          if (this.currentLetterIndex === currentWord.letters.length - 1 && currentWord.letters[this.currentLetterIndex].untouched === false) {
            this.caretPosition = letterElement.offsetLeft + letterElement.offsetWidth + 10;
            // console.log("Cursor is at the end of the word.")

          } else if (this.currentLetterIndex === currentWord.letters.length - 1 && currentWord.letters[this.currentLetterIndex].untouched === true) {
            this.caretPosition = letterElement.offsetLeft + letterElement.offsetWidth;
            // console.log("Cursor is just before the last letter.")

          } else {
            this.caretPosition = letterElement.offsetLeft + letterElement.offsetWidth;
            // console.log("Cursor is inside the word.")

          }
        }

        // If user presses backspace from the last letter (last letter has been touched)
      } else if (this.currentLetterIndex === currentWord.letters.length - 1 && currentWord.letters[this.currentLetterIndex].untouched === false) {
        const letterElement = wordElement.children[this.currentLetterIndex - 1];
        if (letterElement) {
          this.caretPosition = letterElement.offsetLeft + letterElement.offsetWidth;
          console.log("This is the new thing I added!!!");
        }
      }
    }
  }

  hasFalseLetter(word: Word): boolean {
    let mistakeCounter = 0;

    for (let i = 0; i < word.letters.length; i++) {
      if (word.letters[i].correct === false) {
        mistakeCounter++;
      }
    }

    return mistakeCounter > 0;
  }

  isLastWord(word: Word): boolean {
    const testLength: number = this.wordsFromPromise.length;
    const lastWord: Word = this.wordsFromPromise[testLength - 1];

    return word === lastWord;
  }

  goToResultsComponent() {
    console.log("transferring test data now!");
    this.testDataService.setWordsFromPreviousTest(this.wordsFromPromise);

    console.log("You are now navigating to the results page!");
    // this.router.navigate(['/results']);
    this.router.navigate(['/standalone']); // TESTING THIS******
  }

  determineProgress() {

  }

  // ------------------------ Results related properties ------------------------

  testData!: TestData; // Might not need to be an array, just be one value.
  secondsData: SecondsData[] = [];

  // typedCharacters: Letter[] = []; // For tracking each letter typed (right or wrong)
  typedCharacters: TypedLetter[] = []; // Testingggg

  // If typed, add to the array (right or wrong)
  // If backspaced, remove from the array

  // To get the letters that the user needs to type. (for comparison with letters that were actually typed)
  // displayedCharacters: any = this.wordsFromPromise.map(word => word.letters.map(letter => letter.character)).flat();
  // displayedCharacters: string[] = this.wordsFromPromise.flatMap(word => word.letters.map(letter => letter.character));

  errors: Error[] = [];

  testTimer!: any;

  elapsedTime: number = 0; // Current Second
  finalTestType!: string;
  interval!: any;
  pastErrors: number = 0;

  // Need to have a time limit for time-based tests
  // Countdown
  remainingTime = 0;
  countdownInterval: any;


  // ------------------------ Results related properties ------------------------


  // ------------------------ Results-related methods ------------------------

  startTimer() {
    this.elapsedTime = 0;

    const ZeroSecondsData: SecondsData = {
      second: this.elapsedTime,
      wordsPerMinute: 0,
      errors: 0
    };

    this.secondsData.push(ZeroSecondsData);

    this.interval = setInterval(() => {

      if (this.elapsedTime < this.testDuration) {
        this.elapsedTime++;
  
        const currentSecondsData: SecondsData = {
          second: this.elapsedTime,
          wordsPerMinute: 0,
          errors: 0
        };
  
        console.info("SECONDS DATA - second: ", currentSecondsData.second);
        console.info("SECONDS DATA - errors: ", currentSecondsData.errors);
        this.secondsData.push(currentSecondsData);

      }

    }, 1000)
  };

  stopTimer() {
    clearInterval(this.interval);
  }

  // ----------------------- Countdown -----------------------

  startCountdown() {
    this.countdownInterval = setInterval(() => {
      if (this.remainingTime > 0) {
        this.remainingTime--;
      } else {
        console.log("Count down reached 0, stopping the countdown")
        this.stopCountdown();
      }
      console.info("Remaining time: ", this.remainingTime);
    }, 1000);
  }

  stopCountdown() {
    console.log("Countdown has stopped, ending the typing test.")
    this.endTypingTest();
    clearInterval(this.countdownInterval);
    this.goToResultsComponent();
  }

  // ----------------------- Countdown -----------------------

  // ---------------------- Calculations ---------------------- //

  perSecondWpmCalculator(allCharactersTyped: number, allCharactersTypedWrongly: number) {
    let errorPenalty = 0.2;

    console.info("allCharsTyped: ", allCharactersTyped);
    console.info("allCharsTypedWrongly: ", allCharactersTypedWrongly);

    let wpm = Math.round(((allCharactersTyped / 5) - (allCharactersTypedWrongly * errorPenalty)) / (1 / 60)); // WPM calculation with penalty
    wpm = Math.max(0, wpm);

    return wpm;
  }

  overallWpmCalculator(elapsedTime: number): number {
    let allCharactersTyped = 0;
    let allCharactersTypedWrongly = 0;
    let errorPenalty = 0.3;

    for (let letter of this.typedCharacters) {
      if (!letter.correct) {
        allCharactersTypedWrongly++;
      }
    }
    allCharactersTyped = this.typedCharacters.length;

    console.info("Overall WPM: Number of typed characters: ", allCharactersTyped);
    console.info("Overall WPM: Number of wrong characters: ", allCharactersTypedWrongly);

    let wpm = Math.round(((allCharactersTyped / 5) - (allCharactersTypedWrongly * errorPenalty))/ (elapsedTime / 60)); // WPM calculation with penalty
    wpm = Math.max(0, wpm);

    return wpm;
  }

  overallAccuracyCalculator(): number {
    let allCharactersTyped = 0;
    let allCharactersTypedCorrectly = 0;

    for (let letter of this.typedCharacters) {
      if (letter.correct) {
        allCharactersTypedCorrectly++;
      }
    }
    allCharactersTyped = this.typedCharacters.length;

    console.info("Accuracy: Number of correct characters ", allCharactersTypedCorrectly);
    console.info("Accuracy: Number of typed characters ", allCharactersTyped);

    const accuracy = Math.round((allCharactersTypedCorrectly / allCharactersTyped) * 100);

    return accuracy;
  }


  // ---------------------- Start / Stop ----------------------
  startTypingTest() {
    console.log("TYPING TEST HAS STARTED!!!!!");
    this.startTimer();

    if (this.testType === 'time') {
      this.startCountdown(); // Countdown
    }
  }


  endTypingTest() {
    this.stopTimer();
    console.log("TYPING TEST HAS STOPPED!!!!!");

    // Set the test type
    // E.g. time 15 easy (type / how long / difficulty)
    if (this.testType === 'time') {
      console.log("Test is time-based");
      this.finalTestType = `${this.testType} | ${this.testDuration}s | ${this.testDifficulty}`;
      console.info("Test type: ", this.finalTestType);
    } else if (this.testType === 'words') {
      console.log("Test is word-based");
      this.finalTestType = `${this.testType} | ${this.testWordLimit} words | ${this.testDifficulty}`;
      console.info("Test type: ", this.finalTestType);
    } else if (this.testType === 'quote') {
      console.log("Test is quote-based");
      this.finalTestType = this.testType;
    }

    const overallWpm = this.overallWpmCalculator(this.elapsedTime);
    const accuracy = this.overallAccuracyCalculator();
    console.info("Elapsed time: ", this.elapsedTime);
    console.info("Overall WPM: ", overallWpm);
    console.info("Overall accuracy: ", accuracy);


    // Do something****
    // Gives secondsData the updated errors numbers.
    this.setErrorsData(this.secondsData);
    this.setPerSecondWpmData(this.secondsData);


    // Insert values into TestData.
    const currentTestData: TestData = {
      testType: this.finalTestType,
      wordsPerMinute: overallWpm,
      accuracy: accuracy,
      timeTaken: this.elapsedTime, // For word-based tests
      secondsData: this.secondsData
    };

    this.testDataService.setTypedCharacters(this.typedCharacters); // TESTING ONLY********
    this.testDataService.setCurrentTestData(currentTestData);


    // Reset
    this.resetTestData()
    this.secondsData = [];
    this.typedCharacters = [];
    this.elapsedTime = 0;
    this.pastErrors = 0;
    this.remainingTime = 0; // Countdown
    // Testing
    console.info("Words from promise: ", this.wordsFromPromise);
    // console.info("Displayed characters: ", this.displayedCharacters);
  }

  // To iterate through the array to update the errors.
  // With the errors from typedCharacters array.
  setErrorsData(secondsData: SecondsData[]) {

    // Count the number of errors for each second interval
    // <second interval, error count>
    const errorTrackerMap = new Map<number, number>();

    this.typedCharacters.forEach(letter => {
      if (!letter.correct) {
        const count = errorTrackerMap.get(letter.second) || 0;
        errorTrackerMap.set(letter.second, count + 1);
      }
    });

    secondsData.forEach(individualSecondsData => {
      const errorCount = errorTrackerMap.get(individualSecondsData.second) || 0;
      individualSecondsData.errors = errorCount;
    });
  }

  setPerSecondWpmData (secondsData: SecondsData[]) {
    // <second interval, wpm for that interval>
    const wpmtrackerMap = new Map<number, number>();

    let secondsInterval = 0; // For traversing through typedCharacters array.
    let lastIndex = this.typedCharacters.length - 1;
    let maximumSecondsInterval = this.typedCharacters[lastIndex].second;

    let allCharactersTypedInTheSecond = 0;
    let allCharactersTypedWronglyInTheSecond = 0;


    while (secondsInterval <= maximumSecondsInterval) { // Instead of using this.elapsedTime

      for (let char of this.typedCharacters) {
        if (char.second === secondsInterval) { // Finding characters in the same interval
          allCharactersTypedInTheSecond++;
        }
  
        if (char.second === secondsInterval && !char.correct) { // If in the same interval AND typed wrongly
          allCharactersTypedWronglyInTheSecond++;
        }

        // Finished iterating through the array for this interval
      }

      let wpm = this.perSecondWpmCalculator(allCharactersTypedInTheSecond, allCharactersTypedWronglyInTheSecond);
      wpmtrackerMap.set(secondsInterval, wpm); // Updating the map
      console.log(wpmtrackerMap);

      secondsInterval++;
      // Resetting.
      allCharactersTypedInTheSecond = 0;
      allCharactersTypedWronglyInTheSecond = 0;
    }

    // Assigns the calculated wpm to each second (inside secondsData).
    secondsData.forEach(individualSecondsData => {
      const wpm = wpmtrackerMap.get(individualSecondsData.second) || 0;
      individualSecondsData.wordsPerMinute = wpm;
    })
  }

  resetTestData() {
    this.testData = {
      testType: '',
      wordsPerMinute: 0,
      accuracy: 0,
      timeTaken: 0,
      secondsData: []
    }
  }
  
  // Need to know if the test is invalid too:
  // If didn't type out all the words, or
  // If didn't type for the allocated amount of time
  // -> Need to detect if he is afk

  // ------------------------ Results-related methods ------------------------

}
