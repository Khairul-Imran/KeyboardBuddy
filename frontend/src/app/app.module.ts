import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './components/main/main.component';
import { LoginComponent } from './components/login/login.component';
import { TypingComponent } from './components/typing/typing.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SettingsComponent } from './components/settings/settings.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { AboutComponent } from './components/about/about.component';
import { TestgeneratorService } from './testgenerator.service';

import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { QuicksettingsComponent } from './components/quicksettings/quicksettings.component';
import { QuicksettingsService } from './quicksettings.service';
import { TestDataService } from './test-data.service';
import { UserDataService } from './user-data.service';
import { UserStoreService } from './user-store.service';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { LocalStorageService } from './local-storage.service';
import { LoginStatusServiceService } from './login-status-service.service';
import { ServiceWorkerModule } from '@angular/service-worker';
import { ThemeService } from './theme.service';
import { SuccessPageComponent } from './components/success-page/success-page.component';
import { CancelPageComponent } from './components/cancel-page/cancel-page.component';
import { OrderPreviewPageComponent } from './components/order-preview-page/order-preview-page.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// import { StandaloneComponent } from './components/standalone/standalone.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    LoginComponent,
    TypingComponent,
    ProfileComponent,
    SettingsComponent,
    HeaderComponent,
    FooterComponent,
    AboutComponent,
    QuicksettingsComponent,
    SuccessPageComponent,
    CancelPageComponent,
    OrderPreviewPageComponent,
    // StandaloneComponent
  ],
  imports: [
    HttpClientModule,
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    NgbModule,
    
  ],
  providers: [ 
    TestgeneratorService, 
    QuicksettingsService, 
    TestDataService, 
    UserDataService, 
    UserStoreService,
    LocalStorageService,
    LoginStatusServiceService,
    ThemeService,
    provideCharts(withDefaultRegisterables())
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
