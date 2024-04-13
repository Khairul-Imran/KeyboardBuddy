import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { SettingsComponent } from './components/settings/settings.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ResultsComponent } from './components/results/results.component';
import { LeaderboardsComponent } from './components/leaderboards/leaderboards.component';
import { AboutComponent } from './components/about/about.component';
import { StandaloneComponent } from './components/standalone/standalone.component';

const routes: Routes = [
  { path: '', component: MainComponent }, // View 0
  { path: 'login', component: LoginComponent }, // Login View
  { path: 'profile', component: ProfileComponent }, // Profile View
  { path: 'results', component: ResultsComponent }, // Results View
  { path: 'standalone', component: StandaloneComponent}, // TESTING THIS********
  { path: 'settings', component: SettingsComponent }, // Settings View
  { path: 'about', component: AboutComponent }, // About View
  { path: 'leaderboards', component: LeaderboardsComponent }, // Leaderboards View
  { path: '**', redirectTo: '/', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
