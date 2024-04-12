import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { DisplayedTestData, PersonalRecords, User, UserLogin, UserProfile, UserRegistration } from './Models/User';
import { lastValueFrom, map } from 'rxjs';

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
          console.info("Angular service: we received and organised the user: ", user);
          return user;
        })
      )
    );
  }

  // Testing -> 
  // postUserRegistration(userRegistration: UserRegistration): Promise<any> {
  //   return lastValueFrom(this.http.post<any>('/api/register', userRegistration))
  // }

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

  // TODO
  // getUser() {

  // }


  getTestData(userId: number): Promise<DisplayedTestData[]> {
    return lastValueFrom(this.http.get<any>(`/api/testData/${userId}`));
  }

  getPersonalRecords(userId: number): Promise<PersonalRecords[]> {
    return lastValueFrom(this.http.get<PersonalRecords[]>(`/api/personalRecords/${userId}`));
  }

}
