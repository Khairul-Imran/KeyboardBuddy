import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-preview-page',
  templateUrl: './order-preview-page.component.html',
  styleUrl: './order-preview-page.component.css'
})
export class OrderPreviewPageComponent {
  
  private router = inject(Router);
  private http = inject(HttpClient);
  
  // themesPackage!: any;
  
  // ngOnInit(): void {

  // }

  makePayment(): void {
    this.http.post('http://localhost:8080/create-checkout-session', {})
      .subscribe((response: any) => {
        console.info("Redirecting to stripe checkout page.");
        window.location.href = response.url;
      })
  }



}
