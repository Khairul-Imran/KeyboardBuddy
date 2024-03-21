import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class QuicksettingsService {

  constructor() { }

  private _testType: string = "time"; // time or limited
  private _testDifficulty: string = "hard"; // easy or hard
  private _wordLimit: number = 7; 
  private _testDuration: number = 60; // in seconds

  
  public get testType() : string {
    return this._testType;
  }

  public set testType(v : string) {
    this._testType = v;
  }
  
  public get testDifficulty() : string {
    return this._testDifficulty;
  }

  public set testDifficulty(v : string) {
    this._testDifficulty = v;
  }

  public get wordLimit() : number {
    return this._wordLimit;
  }

  public set wordLimit(v : number) {
    this._wordLimit = v;
  }

  public get testDuration() : number {
    return this._testDuration;
  }

  public set testDuration(v : number) {
    this._testDuration = v;
  }

}
