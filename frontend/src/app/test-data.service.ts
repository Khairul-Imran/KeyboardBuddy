import { Injectable, inject } from '@angular/core';
import { Letter, Word } from './Models/Words';
import { SecondsData, TestData, TypedLetter } from './Models/TestData';

@Injectable({
  providedIn: 'root'
})
export class TestDataService {

  constructor() { }

  wordsFromPreviousTest: any;
  testType!: string;
  overallWpm!: any;
  accuracy!: number;
  timeTaken!: number; // for word-based tests.

  // --------------- For testing purposes ---------------
  typedCharacters!: TypedLetter[]; // Changed this

  setTypedCharacters(typedCharacters: TypedLetter[]) { // Changed this
    this.typedCharacters = typedCharacters;
  }

  getTypedCharacters() {
    return this.typedCharacters;
  }

  // --------------- For testing purposes ---------------

  // Test Data holder
  private currentTestData: TestData = {
    testType: '',
    wordsPerMinute: 0,
    accuracy: 0,
    timeTaken: 0, // For word-based tests
    secondsData: []
  }

  // Results
  setCurrentTestData(testData: TestData) {
    this.currentTestData = testData;
  }

  getCurrentTestData(): TestData {
    return this.currentTestData;
  }

  // Words
  setWordsFromPreviousTest(words: Word[]) {
    this.wordsFromPreviousTest = words;
  }

  getWordsFromPreviousTest() {
    return this.wordsFromPreviousTest;
  }

  clearWordsFromPreviousTest() {
    this.wordsFromPreviousTest = null;
  }

  // Flow: User finishes test -> goToResultsComponent() sets the words from this test into the service
  // -> user goes to the results page -> 
  // user chooses to do a new test (generateNewTest()) -> method CLEARS the existing test from the service -> navigates to typing page


  // TODO: Remove later.
  // For results
  // setTestType(testType: string) {
  //   this.testType = testType;
  // }

  // getTestType() {
  //   return this.testType;
  // }

  // setOverallWpm(overallWpm: number) {
  //   if (overallWpm > 0) {
  //     this.overallWpm = overallWpm;
  //   } else {
  //     this.overallWpm = "Invalid";
  //   }
  // }

  // getOverallWpm() {
  //   return this.overallWpm;
  // }

  // setAccuracy(accuracy: number) {
  //   this.accuracy = accuracy;
  // }

  // getAccuracy() {
  //   return this.accuracy;
  // }

  // setTimeTaken(timeTaken: number) {
  //   this.timeTaken = timeTaken;
  // }

  // getTimeTaken() {
  //   return this.timeTaken;
  // }
}
