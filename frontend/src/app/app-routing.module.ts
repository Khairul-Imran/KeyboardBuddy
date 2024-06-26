import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { SettingsComponent } from './components/settings/settings.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AboutComponent } from './components/about/about.component';
import { StandaloneComponent } from './components/standalone/standalone.component';
import { SuccessPageComponent } from './components/success-page/success-page.component';
import { CancelPageComponent } from './components/cancel-page/cancel-page.component';
import { OrderPreviewPageComponent } from './components/order-preview-page/order-preview-page.component';

const routes: Routes = [
  { path: '', component: MainComponent }, // View 0
  { path: 'login', component: LoginComponent }, // Login View
  { path: 'profile', component: ProfileComponent }, // Profile View
  { path: 'standalone', component: StandaloneComponent}, // This is the results
  { path: 'settings', component: SettingsComponent }, // Settings View
  { path: 'about', component: AboutComponent }, // About View
  { path: 'success', component: SuccessPageComponent }, // Successful payment
  { path: 'cancel', component: CancelPageComponent }, // Cancelled payment
  { path: 'order-preview', component: OrderPreviewPageComponent }, // Order preview
  { path: '**', redirectTo: '/', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
