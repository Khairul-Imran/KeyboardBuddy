import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { DisplayedTestData, PersonalRecords, User, UserLogin, UserProfile, UserRegistration } from './Models/User';
import { Observable, lastValueFrom, map } from 'rxjs';
import { TestData } from './Models/TestData';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  private http = inject(HttpClient);

  // Login / Register
  postUserRegistration(userRegistration: UserRegistration): Promise<User> {
    return lastValueFrom(this.http.post<any>('/api/register', userRegistration)
      .pipe(
        map((response: User) => {
          const user: User = {
            userId: response.userId,
            joinedDate: response.joinedDate,
            username: response.username,
            email: response.email,
            userProfile: {
              profileId: response.userProfile.profileId, 
              testsCompleted: response.userProfile.testsCompleted, 
              timeSpentTyping: response.userProfile.timeSpentTyping, 
              currentStreak: response.userProfile.currentStreak, 
              selectedTheme: response.userProfile.selectedTheme, 
              hasPremium: response.userProfile.hasPremium, 
              userId: response.userProfile.userId
            }
          };
          console.info("Angular user data service: we received and organised the user: ", user);
          return user;
        })
      )
    );
  }

  postUserLogin(userLogin: UserLogin): Promise<User> {
    return lastValueFrom(this.http.post<any>('/api/login', userLogin)
      .pipe(
        map((response: User) => {
          const user: User = {
            userId: response.userId,
            joinedDate: response.joinedDate,
            username: response.username,
            email: response.email,
            userProfile: {
              profileId: response.userProfile.profileId, 
              testsCompleted: response.userProfile.testsCompleted, 
              timeSpentTyping: response.userProfile.timeSpentTyping, 
              currentStreak: response.userProfile.currentStreak, 
              selectedTheme: response.userProfile.selectedTheme, 
              hasPremium: response.userProfile.hasPremium, 
              userId: response.userProfile.userId
            }
          };
          console.info("Angular user data service: we received and organised the user: ", user);
          return user;
        })
      )
    );
  }

  // Displayed in the profile -> probably don't need this anymore
  getUserProfile(userId: number): Promise<UserProfile> {
    return lastValueFrom(this.http.get<UserProfile>(`/api/${userId}/userProfile`)
      .pipe(
        map((response: UserProfile) => {
          const userProfile: UserProfile = {
            profileId: response.profileId,
            testsCompleted: response.testsCompleted,
            timeSpentTyping: response.timeSpentTyping,
            currentStreak: response.currentStreak,
            selectedTheme: response.selectedTheme,
            hasPremium: response.hasPremium,
            userId: response.userId
          };
          return userProfile;
        })
      )
    );
  }


  getTestData(userId: number): Promise<DisplayedTestData[]> {
    return lastValueFrom(this.http.get<any>(`/api/testData/${userId}`));
  }

  getPersonalRecords(userId: number): Promise<PersonalRecords[]> {
    return lastValueFrom(this.http.get<PersonalRecords[]>(`/api/personalRecords/${userId}`));
  }

  // Post Test Data
  postTestData(testData: TestData, userId: number): Promise<any> {
    const params = new HttpParams()
      .set('userId', userId);
    
    return lastValueFrom(this.http.post('/api/testData', testData, { params, responseType: 'text' }));
  }

  
  updateUserProfileAfterTest(userId: number, testsCompleted: number, timeSpentTyping: number, currentStreak: number): Promise<any> {

    const requestBody = {
      testsCompleted: testsCompleted,
      timeSpentTyping: timeSpentTyping,
      currentStreak: currentStreak
    };

    console.info("HTTP Method - This is your request body: ", requestBody);

    return lastValueFrom(this.http.put(`/api/updateAfterTest/${userId}`, requestBody, { responseType: 'text' }));
  }

  // Update theme and premium
  updateUserProfileAfterPurchase(userId: number, hasPremium: boolean): Promise<any> {
    const requestBody = {
      hasPremium: hasPremium
    };

    console.info("HTTP Method - This is your request body (has premium): ", requestBody);

    return lastValueFrom(this.http.put(`/api/updateAfterPurchase/${userId}`, requestBody, { responseType: 'text'}));
  }

  updateUserProfileTheme(userId: number, selectedTheme: string): Promise<any> {
    const requestBody = {
      selectedTheme: selectedTheme
    };

    console.info("HTTP Method - This is your request body (theme): ", requestBody);

    return lastValueFrom(this.http.put(`/api/updateTheme/${userId}`, requestBody, { responseType: 'text'}));
  }

}
