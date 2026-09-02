import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface ToastMessage {
  type: 'success' | 'error';
  message: string;
  title?: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly toastSubject = new Subject<ToastMessage>();
  readonly toast$ = this.toastSubject.asObservable();

  success(message: string, title?: string): void {
    this.toastSubject.next({ type: 'success', message, title });
  }

  error(message: string, title?: string): void {
    this.toastSubject.next({ type: 'error', message, title });
  }
}
