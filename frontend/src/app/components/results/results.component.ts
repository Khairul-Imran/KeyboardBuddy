import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { QuicksettingsService } from '../../quicksettings.service';
import { TestgeneratorService } from '../../testgenerator.service';
import { Observable } from 'rxjs';
import { Letter, Word } from '../../Models/Words';
import { TestDataService } from '../../test-data.service';
import { TestData, TypedLetter } from '../../Models/TestData';
import { BaseChartDirective } from 'ng2-charts';
import { ChartDataset, ChartOptions } from 'chart.js';


@Component({
  // standalone: true, // Added this
  // imports: [BaseChartDirective], // Added this
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrl: './results.component.css'
})
export class ResultsComponent implements OnInit {
  
  private router = inject(Router);
  private testDataService = inject(TestDataService);
  
  wordsFromPreviousTest: Word[] = [];
  testType!: string;
  overallWpm!: any;
  accuracy!: number;
  timeTaken!: number;

  showPreviousTest: boolean = false;

  // Results related properties.
  testData!: TestData;

  // Testing only******
  // typedCharacters!: Letter[];
  typedCharacters!: TypedLetter[];

  chartData!: ChartDataset[];
  chartLabels! : number[]; // x-axis (seconds)
  chartOptions!: ChartOptions;

  ngOnInit(): void {
    this.wordsFromPreviousTest = this.testDataService.getWordsFromPreviousTest();

    // Results
    this.testData = this.testDataService.getCurrentTestData();
    // Testing only
    this.typedCharacters = this.testDataService.getTypedCharacters();




  }

  
  togglePreviousTest() {
    this.showPreviousTest = !this.showPreviousTest;
  }
  
  generateNewTest() {
    this.testDataService.clearWordsFromPreviousTest();
    this.router.navigate(['/']);
  }

  // Chart
  generateChartLabels() {
    this.chartLabels = this.testData.secondsData.map(data => data.second);
  }

  generateChartData() {
    this.chartData = [
      {
        data: this.testData.secondsData.map(data => data.wordsPerMinute),
        label: "Words per Minute",
        type: 'line',
        yAxisID: 'wpm-axis'
      }, 
      {
        data: this.testData.secondsData.map(data => data.errors),
        label: "Errors",
        type: 'line',
        yAxisID: 'errors-axis',
        pointStyle: 'cross',
        pointRadius: 8,
        showLine: false
      }
    ];
  }

  // generateChartOptions() {
  //   this.chartOptions = {
  //     responsive: true,
  //     scales: {
  //       xAxes: [{ scaleLabel: {display: true, labelString: 'Seconds'} }],
  //       yAxes: [
  //         {
  //           id: 'wpm-axis',
  //           position: 'left',
  //           scaleLabel: {display: true, labelString: 'Words per Minute'},
  //           ticks: { beginAtZero: true }
  //         },
  //         {
  //           id: 'errors-axis',
  //           position: 'right',
  //           scaleLabel: { display: true, labelString: 'Errors' },
  //           ticks: { beginAtZero: true, stepSize: 1 }
  //         }
  //       ]
  //     }
  //   }
  // }

}
