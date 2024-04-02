import { Injectable, inject } from '@angular/core';
import { Word } from './Models/Words';

@Injectable({
  providedIn: 'root'
})
export class TestDataService {

  // This service will store data relating to tests.

  constructor() { }

  // TODO: Create a test data interface to hold the necessary info.

  wordsFromPreviousTest: any;
  testType!: string;
  overallWpm!: number;
  accuracy!: number;


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


  // For results
  setTestType(testType: string) {
    this.testType = testType;
  }

  getTestType() {
    return this.testType;
  }

  setOverallWpm(overallWpm: number) {
    this.overallWpm = overallWpm;
  }

  getOverallWpm() {
    return this.overallWpm;
  }

  setAccuracy(accuracy: number) {
    this.accuracy = accuracy;
  }

  getAccuracy() {
    return this.accuracy;
  }


}
