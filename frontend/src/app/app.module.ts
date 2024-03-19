import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './components/main/main.component';
import { LoginComponent } from './components/login/login.component';
import { TypingComponent } from './components/typing/typing.component';
import { ResultsComponent } from './components/results/results.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SettingsComponent } from './components/settings/settings.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ProgressbarComponent } from './components/progressbar/progressbar.component';
import { TimerComponent } from './components/timer/timer.component';
import { LeaderboardsComponent } from './components/leaderboards/leaderboards.component';
import { AboutComponent } from './components/about/about.component';
import { TestgeneratorService } from './testgenerator.service';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    LoginComponent,
    TypingComponent,
    ResultsComponent,
    ProfileComponent,
    SettingsComponent,
    HeaderComponent,
    FooterComponent,
    ProgressbarComponent,
    TimerComponent,
    LeaderboardsComponent,
    AboutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [ TestgeneratorService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
