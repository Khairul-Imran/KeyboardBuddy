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

  // Default 
  private settings: QuickSettings = {
    testType: "time",// time or words
    testDifficulty: "easy", // easy or hard
    wordLimit: 20,
    testDuration: 30 // in seconds
  };

  // Receives updates from .next method (in sendUpdatedSettings)
  private settingsSource = new BehaviorSubject<QuickSettings>({
    testType: this.settings.testType,
    testDifficulty: this.settings.testDifficulty,
    wordLimit: this.settings.wordLimit,
    testDuration: this.settings.testDuration
  });

  // Sends updates to its subscribers (other components) whenever a change is detected in settingsSource.
  testSettings$: Observable<QuickSettings> = this.settingsSource.asObservable();

  // Sends updated settings back to settingsSource.
  sendUpdatedSettings(newSettings: QuickSettings) {
    this.settingsSource.next(newSettings);
  }

  // Getters and setters.
  public get testType() : string {
    return this.settings.testType;
  }

  public set testType(v : string) {
    this.settings.testType = v;
    console.info("From quicksettings service: Changing test type to: ", v);
    console.info("From quicksettings service: Test type has been set to: ", this.settings.testType);

    this.sendUpdatedSettings(this.settings);
  }
  
  public get testDifficulty() : string {
    return this.settings.testDifficulty;
  }

  public set testDifficulty(v : string) {
    this.settings.testDifficulty = v;
    console.info("From quicksettings service: Changing test difficulty to: ", v);
    console.info("From quicksettings service: Test difficulty has been set to: ", this.settings.testDifficulty);

    this.sendUpdatedSettings(this.settings);
  }

  public get wordLimit() : number | null {
    return this.settings.wordLimit;
  }

  public set wordLimit(v : number) {
    if (this.settings.wordLimit !== v) {
      this.settings.wordLimit = v;
      console.info("From quicksettings service: Changing word limit to: ", v);
      console.info("From quicksettings service: Word limit has been set to: ", this.settings.wordLimit);
  
      this.sendUpdatedSettings(this.settings);
    }
  }

  public get testDuration() : number | null {
    return this.settings.testDuration;
  }

  public set testDuration(v : number) {
    this.settings.testDuration = v;
    console.info("From quicksettings service: Changing test duration to: ", v);
    console.info("From quicksettings service: Test duration has been set to: ", this.settings.testDuration);

    this.sendUpdatedSettings(this.settings);
  }
}
