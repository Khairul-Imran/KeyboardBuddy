import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, lastValueFrom, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TestgeneratorService {

  private http = inject(HttpClient);

  // Time-based test
  getRandomWordsTest(testType: string, testDifficulty: string): Observable<string[]> {
    const params = new HttpParams()
      .set('testType', testType)
      .set('testDifficulty', testDifficulty);

    return this.http.get<string>('/api/words', { params: params, responseType: 'json' })
      .pipe(
        map((response: any) => response.words),
        map((words: string) => words.split(' ')) // Added this. And changed return type to string[]
      );
  }

  // Words-based test
  getRandomWordsTestLimited(testType: string, testDifficulty: string, limit: number): Promise<string[]> {
    const params = new HttpParams()
      .set('testType', testType)
      .set('testDifficulty', testDifficulty)
      .set('limit', limit);

    return lastValueFrom(this.http.get<string>('/api/words', { params: params, responseType: 'json' })
      .pipe(
        map((response: any) => response.words),
        map((words: string) => words.split(' ')) // Added this.
      ));
  }
}
