import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { QuicksettingsService } from '../../quicksettings.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrl: './timer.component.css'
})
export class TimerComponent {
  
  private quicksettingsService = inject(QuicksettingsService);
  private subscription!: Subscription;
  
  // MIGHT NOT NEED THIS COMPONENT


  duration = 0;
  remainingTime = 0;
  interval: any;
  
  // ngOnInit(): void {
  //   this.subscription = this.quicksettingsService.countDown$.subscribe(testDuration => {
  //     this.duration = testDuration;
  //     this.remainingTime = testDuration;
  //   });
  // }
  
  // startTimer() {

  // }
  
  // stopTimer() {
    
  // }
  
  // ngOnDestroy(): void {

  // }



}
