import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ValidationErrors } from '@angular/forms';
import { delay } from 'rxjs/operators';

@Injectable()
export class EmailValidationService {
  private emailData: string[];

  constructor() {
    this.emailData = ['test@test.test', '1@1.ru'];
  }

  validateEmail(userEmail: string): Observable<ValidationErrors> {
    return new Observable<ValidationErrors>((observer) => {
      const email = this.emailData.find((email) => email === userEmail);
      if (email) {
        observer.next({
          invalidAsync: true,
        });
        observer.complete();
      }
      observer.next(null);
      observer.complete();
    }).pipe(delay(2000));
  }
}
