import { Component, inject } from '@angular/core';
import { QuicksettingsService } from '../../quicksettings.service';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrl: './timer.component.css'
})
export class TimerComponent {

  private quicksettingsService = inject(QuicksettingsService);

}
