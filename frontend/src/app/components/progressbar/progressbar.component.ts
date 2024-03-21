import { Component, inject } from '@angular/core';
import { QuicksettingsService } from '../../quicksettings.service';

@Component({
  selector: 'app-progressbar',
  templateUrl: './progressbar.component.html',
  styleUrl: './progressbar.component.css'
})
export class ProgressbarComponent {

  private quicksettingsService = inject(QuicksettingsService);

}
