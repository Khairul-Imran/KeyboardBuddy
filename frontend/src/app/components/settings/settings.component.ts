import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ThemeService } from '../../theme.service';



@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css', 
    '../../../themes/theme1.css', 
    '../../../themes/theme2.css', 
    '../../../themes/theme3.css'
  ]
})
export class SettingsComponent {

  private themeService = inject(ThemeService);
  
  // chosenTheme!: string;
  currentTheme!: string;
  // selectTheme(theme: string) {
  //   this.chosenTheme = theme;
  // }

  ngOnInit(): void {
    this.themeService.getChosenTheme().subscribe(chosenTheme => {
      this.currentTheme = chosenTheme;
    })
  }


  detectThemeChanges(newTheme: string) {
    this.themeService.sendUpdatedTheme(newTheme);
  }

}
