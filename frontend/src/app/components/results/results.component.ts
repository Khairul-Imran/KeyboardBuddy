import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { QuicksettingsService } from '../../quicksettings.service';
import { TestgeneratorService } from '../../testgenerator.service';
import { Observable } from 'rxjs';
import { Word } from '../../Models/Words';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrl: './results.component.css'
})
export class ResultsComponent {

  private router = inject(Router);
  private quicksettingsService = inject(QuicksettingsService);
  private testGeneratorService = inject(TestgeneratorService);

  testType = "time"
  testDifficulty = "easy"
  words$!: Observable<Word[]>

  // sendHttpRequest() {
  //   console.log("Generating new test from results");

  //   if (this.testType === 'time') {
  //     // Time-based
  //     console.log(`Settings: Type=${this.testType}, Difficulty=${this.testDifficulty}`);
  //     this.words$ = this.testGeneratorService.getRandomWordsTest(this.testType, this.testDifficulty);

  //     this.words$.subscribe(words => {
  //       this.wordsFromObservable = words;
  //     })
  //     console.info("These are the words inside the array: ", this.wordsFromObservable);

  //   } else if (this.testType === 'words') {
  //     Word-based
  //     console.log(`Settings: Type=${this.testType}, Difficulty=${this.testDifficulty}, Word Limit=${this.testWordLimit}`);
  //     this.words$ = this.testGeneratorService.getRandomWordsTestLimited(this.testType, this.testDifficulty, this.testWordLimit)

  //     this.words$.subscribe(words => {
  //       this.wordsFromObservable = words;
  //     })
  //     console.info("These are the words inside the array: ", this.wordsFromObservable);
  //   }

  // }

  

}
