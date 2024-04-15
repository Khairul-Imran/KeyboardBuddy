import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cancel-page',
  templateUrl: './cancel-page.component.html',
  styleUrl: './cancel-page.component.css'
})
export class CancelPageComponent {


  private router = inject(Router);

  backToSettingsPage() {
    this.router.navigate(['/settings']);
  }

}
