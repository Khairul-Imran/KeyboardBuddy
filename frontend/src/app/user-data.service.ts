import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { DisplayedTestData, PersonalRecords, UserLogin, UserProfile, UserRegistration } from './Models/User';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  private http = inject(HttpClient);

  // Login / Register
  postUserRegistration(userRegistration: UserRegistration): Promise<any> {
    return lastValueFrom(this.http.post<any>('/register', userRegistration));
  }

  postUserLogin(userLogin: UserLogin): Promise<any> {
    return lastValueFrom(this.http.post<any>('/login', userLogin));
  }

  // Displayed in the profile
  // How do i get the userIds though????
  getUserProfile(userId: number): Promise<UserProfile> {
    return lastValueFrom(this.http.get<UserProfile>(`/${userId}/userProfile`));
  }

  // What if these are empty at first? How can I display a placeholder?
  getTestData(userId: number): Promise<DisplayedTestData[]> {
    return lastValueFrom(this.http.get<DisplayedTestData[]>(`/${userId}/testData`));
  }

  getPersonalRecords(userId: number): Promise<PersonalRecords[]> {
    return lastValueFrom(this.http.get<PersonalRecords[]>(`/${userId}/personalRecords`));
  }

}
