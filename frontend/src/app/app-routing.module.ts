import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { SettingsComponent } from './components/settings/settings.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ResultsComponent } from './components/results/results.component';

const routes: Routes = [
  { path: '', component: MainComponent }, // View 0
  { path: 'login', component: LoginComponent }, // Login View
  { path: 'profile', component: ProfileComponent }, // Profile View
  { path: 'results', component: ResultsComponent }, // Results View
  { path: 'settings', component: SettingsComponent }, // Settings View
  { path: '**', redirectTo: '/', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
