import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { QuickSettings } from './Models/QuickSettings';

@Injectable({
  providedIn: 'root'
})
export class QuicksettingsService {

  constructor() { }

  // Flow:
  // quicksettings COMPONENT will make changes to the settings (using the QuicksettingsService's setter methods)
  // These setter methods then change the QuickSettings object's properties inside the service.
  // We then call sendUpdateSettings to send these updates to settingsSource, which triggers the BehaviourSubject
  // to emit the new changes to its subscribers through the Observable (testSettings$)

  // Settings holder
  private settings: QuickSettings = {
    testType: "time",// time or words
    testDifficulty: "easy", // easy or hard
    testWordLimit: 20,
    testDuration: 30 // in seconds
  };

  // Receives updates from .next method (in sendUpdatedSettings)
  private settingsSource = new BehaviorSubject<QuickSettings>({
    testType: this.settings.testType,
    testDifficulty: this.settings.testDifficulty,
    testWordLimit: this.settings.testWordLimit,
    testDuration: this.settings.testDuration
  });

  // Sends updates to its subscribers (other components) whenever a change is detected in settingsSource.
  testSettings$: Observable<QuickSettings> = this.settingsSource.asObservable();

  // Sends updated settings back to settingsSource.
  sendUpdatedSettings(newSettings: QuickSettings) {
    this.settingsSource.next(newSettings);
  }


  // Getters and setters.
  public set testType(v : string) {
    this.settings.testType = v;
    // console.info("From quicksettings service: Changing test type to: ", v);
    console.info("From quicksettings service: Test type has been set to: ", this.settings.testType);
    
    this.sendUpdatedSettings(this.settings);
  }

  public set testDifficulty(v : string) {
    this.settings.testDifficulty = v;
    // console.info("From quicksettings service: Changing test difficulty to: ", v);
    console.info("From quicksettings service: Test difficulty has been set to: ", this.settings.testDifficulty);

    this.sendUpdatedSettings(this.settings);
  }

  public set testWordLimit(v : number) {
    if (this.settings.testWordLimit !== v) {
      this.settings.testWordLimit = v;
      // console.info("From quicksettings service: Changing word limit to: ", v);
      console.info("From quicksettings service: Word limit has been set to: ", this.settings.testWordLimit);
  
      this.sendUpdatedSettings(this.settings);
    }
  }

  public set testDuration(v : number) {
    this.settings.testDuration = v;
    // console.info("From quicksettings service: Changing test duration to: ", v);
    console.info("From quicksettings service: Test duration has been set to: ", this.settings.testDuration);

    this.sendUpdatedSettings(this.settings);
  }

  public get testType() : string {
    return this.settings.testType;
  }
  
  public get testDifficulty() : string {
    return this.settings.testDifficulty;
  }

  public get testWordLimit() : number {
    return this.settings.testWordLimit;
  }

  public get testDuration() : number {
    return this.settings.testDuration;
  }
}
