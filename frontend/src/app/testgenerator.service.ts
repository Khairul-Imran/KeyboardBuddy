import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TestgeneratorService {

  private http = inject(HttpClient);

  getRandomWordsTest(testType: string, testDifficulty: string): Observable<any> {
    const params = new HttpParams()
      .set('testType', testType)
      .set('testDifficulty', testDifficulty);

    return this.http.get<any>('/api/words', { params: params });
  }


  getRandomWordsTestLimited(testType: string, testDifficulty: string, limit: number): Promise<any> {
    const params = new HttpParams()
      .set('testType', testType)
      .set('testDifficulty', testDifficulty)
      .set('limit', limit);

    return lastValueFrom(this.http.get<any>('/api/words', { params: params }));
  }
}
