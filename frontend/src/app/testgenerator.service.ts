import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, lastValueFrom, map } from 'rxjs';
import { Letter, Quote, Word } from './Models/Words';

@Injectable({
  providedIn: 'root'
})
export class TestgeneratorService {

  private http = inject(HttpClient);

  // Time-based test
  getRandomWordsTest(testType: string, testDifficulty: string): Promise<Word[]> {
    const params = new HttpParams()
      .set('testType', testType)
      .set('testDifficulty', testDifficulty);

    return lastValueFrom(this.http.get<string>('/api/words', { params: params, responseType: 'json' })
      .pipe(
        map((response: any) => response.words),
        map((sentence: string) => {
          const individualWords: Word[] = sentence.split(' ').map(word => ({
              letters: word.split('').map(c => ({ character: c, correct: false, untouched: true })),
              fullyCorrect: false,
              untouched: true
            }));
            // console.log("Client: Retrieved data from server!");
            return individualWords;
        })
      ));
  }

  // Words-based test
  getRandomWordsTestLimited(testType: string, testDifficulty: string, limit: number): Promise<Word[]> {
    const params = new HttpParams()
      .set('testType', testType)
      .set('testDifficulty', testDifficulty)
      .set('limit', limit);

    return lastValueFrom(this.http.get<string>('/api/words', { params: params, responseType: 'json' })
      .pipe(
        map((response: any) => response.words),
        map((sentence: string) => {
          const individualWords: Word[] = sentence.split(' ').map(word => ({
            letters: word.split('').map(c => ({ character: c, correct: false, untouched: true})),
            fullyCorrect: false,
            untouched: true
          }));
          return individualWords;
        })
      ));
  }

  getQuoteTest(): Promise<Quote> {
    return lastValueFrom(this.http.get<string>('/api/quotes', { responseType: 'json'})
      .pipe(
        map((response: any) => {
          console.info("Original response: ", response);
          const updatedQuote: string = response.quote.toLowerCase().replace(/[^a-z\s]/g, '');
          console.info("Updated quote: ", updatedQuote);

          const quoteWords: Word[] = updatedQuote.split(' ').map(word => {
            const letters: Letter[] = word.split('').map(char => ({
              character: char,
              correct: false,
              untouched: true
            }));
            console.info("Letters: ", letters);
            return {
              letters,
              fullyCorrect: false,
              untouched: true
            };
          });
          console.info("Full quote: ", quoteWords);
          return { sentence: quoteWords, author: response.author };
        })
      ))
  }

  // getQuoteTest(): Promise<Quote> {
  //   return lastValueFrom(this.http.get<string>('/api/quotes', { responseType: 'json'})
  //     .pipe(
  //       map((response: any) => {
  //         const updatedQuote: string = response.quote.toLowerCase().replace(/[^a-z]/g, '');

  //         const quoteWords: Word[] = updatedQuote.split(' ').map(word => ({
  //           letters: word.split('').map(c => ({ character: c, correct: false, untouched: true})),
  //           fullyCorrect: false,
  //           untouched: true
  //         }
          
  //         ));
  //         return { sentence: quoteWords, author: response.author };
  //       })
  //     ))
  // }

}
