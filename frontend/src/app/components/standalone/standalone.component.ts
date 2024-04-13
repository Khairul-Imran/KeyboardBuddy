import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { QuicksettingsService } from '../../quicksettings.service';
import { TestgeneratorService } from '../../testgenerator.service';
import { Observable } from 'rxjs';
import { Letter, Word } from '../../Models/Words';
import { TestDataService } from '../../test-data.service';
import { TestData, TypedLetter } from '../../Models/TestData';
import { BaseChartDirective } from 'ng2-charts'; // Added this
import { ChartDataset, ChartOptions } from 'chart.js';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [BaseChartDirective, CommonModule],
  selector: 'app-standalone',
  templateUrl: './standalone.component.html',
  styleUrl: './standalone.component.css'
})
export class StandaloneComponent implements OnInit {

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

    this.generateChartData();
    this.generateChartLabels();
    this.generateChartOptions();
  }

  
  togglePreviousTest() {
    this.showPreviousTest = !this.showPreviousTest;
  }
  
  generateNewTest() {
    this.testDataService.clearWordsFromPreviousTest();
    this.router.navigate(['/']);
  }

  // Chart
  generateChartData() {
    this.chartData = [
      {
        data: this.testData.secondsData.map(data => data.wordsPerMinute),
        label: "WPM",
        type: 'line',
        yAxisID: 'wpm-axis'
      }, 
      {
        data: this.testData.secondsData.map(data => data.errors),
        label: "Errors",
        type: 'line',
        showLine: false,
        yAxisID: 'errors-axis',
        pointStyle: 'crossRot',
        pointRadius: (hasError) => {
          const errors = hasError.dataset.data[hasError.dataIndex];
          return typeof errors === 'number' && errors > 0 ? 8 : 0;
        },
        pointBorderWidth: 3
      }
    ];
  }

  generateChartOptions() {
    this.chartOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom'
        },
        tooltip: {
          enabled: true
        }
      },
      interaction: {
        mode: 'index',
        intersect: false
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Seconds'
          }
        },
        'errors-axis': {
          title: {
            display: true,
            text: 'Errors Made'
          },
          grid: {
            display: false
          },
          position: 'right',
          ticks: {
            stepSize: 1
          },
          suggestedMax: 5,
          beginAtZero: true
        },
        'wpm-axis': {
          title: {
            display: true,
            text: 'WPM'
          },
          position: 'left',
          beginAtZero: true
        }
      }
    }
  }

  generateChartLabels() {
    this.chartLabels = this.testData.secondsData.map(data => data.second);
  }

}
