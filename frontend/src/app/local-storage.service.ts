import { Injectable } from '@angular/core';
import { DisplayedTestData, PersonalRecords, User } from './Models/User';
import { UntypedFormBuilder } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  saveUserToLocalStorage(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUserFromLocalStorage(): User | undefined {
    const user = localStorage.getItem('user');
    if (!!user) {
      return JSON.parse(user) as User;
    }

    return undefined;
  }

  // Save the test data and personal records -> to be called after they are generated in the profile
  saveTestDataToLocalStorage(testData: DisplayedTestData[]) {
    localStorage.setItem('testData', JSON.stringify(testData));
  }

  savePersonalRecordsToLocalStorage(personalRecords: PersonalRecords[]) {
    localStorage.setItem('personalRecords', JSON.stringify(personalRecords));
  }

  // Get the test data and personal records
  getTestDataFromLocalStorage(): DisplayedTestData[] | undefined {
    const testData = localStorage.getItem('testData');
    if (!!testData) {
      return JSON.parse(testData) as DisplayedTestData[];
    }

    return undefined;
  }

  getPersonalRecordsFromLocalStorage(): PersonalRecords[] | undefined {
    const personalRecords = localStorage.getItem('personalRecords');
    if (!!personalRecords) {
      return JSON.parse(personalRecords) as PersonalRecords[];
    }

    return undefined;
  }

}
