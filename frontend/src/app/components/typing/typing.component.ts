import { Component, OnInit, inject } from '@angular/core';
import { TestgeneratorService } from '../../testgenerator.service';
import { Observable } from 'rxjs';
import { QuicksettingsService } from '../../quicksettings.service';

@Component({
  selector: 'app-typing',
  templateUrl: './typing.component.html',
  styleUrl: './typing.component.css'
})
export class TypingComponent implements OnInit {
  
  private testgeneratorService = inject(TestgeneratorService);
  private quicksettingsService = inject(QuicksettingsService);
  
  words$!: Observable<any>;
  wordsP$!: Promise<any>;
  errorMessage!: string;

  // Need to change this to allow the user to choose the options.
  // While testing, don't forget to change accordingly.
  testType: string = "time"; // time or limited
  testDifficulty: string = "hard";
  // limit: number = 7;

  ngOnInit(): void {
    this.generateNewTest();
    // this.generateNewLimitedTest();
  }

  generateNewTest() {
    console.log("Generating new test");
    this.words$ = this.testgeneratorService.getRandomWordsTest(this.testType, this.testDifficulty);
  }

  // generateNewLimitedTest() {
  //   console.log("Generating new limited test");
  //   this.wordsP$ = this.testgeneratorService.getRandomWordsTestLimited(this.testType, this.testDifficulty, this.limit);
  // }

}
