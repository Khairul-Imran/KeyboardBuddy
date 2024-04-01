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
  // or user chooses to redo the previous test (redoTest()) -> method doesn't clear the existing test from service -> navigates to typing page
  // OnInit of the typing page, if it detects that there is an existing test (from previous test) -> it will use that test
  // If not, it will generate a totally new test.

}
