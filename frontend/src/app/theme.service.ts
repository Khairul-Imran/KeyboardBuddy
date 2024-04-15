import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  constructor() { }

  currentTheme: string = 'theme1';

  // Receives updates from the .next method (in sendUpdatedTheme)
  private themeSource$ = new BehaviorSubject<string>(this.currentTheme);


  getChosenTheme() {
    return this.themeSource$.asObservable();
  }

  // Sends updated theme to themeSource.
  sendUpdatedTheme(newTheme: string) {
    this.themeSource$.next(newTheme);
  }



}
