import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  loadingText?: string;
  icon?: string;
}

@Injectable({ providedIn: 'root' })
export class ConfirmService {
  private currentResult: Subject<boolean> | null = null;
  private currentOptions: ConfirmOptions | null = null;
  private loading = false;

  get options(): ConfirmOptions | null {
    return this.currentOptions;
  }

  get isOpen(): boolean {
    return !!this.currentOptions;
  }

  get isLoading(): boolean {
    return this.loading;
  }

  open(options: ConfirmOptions): Observable<boolean> {
    this.close(false);
    this.currentOptions = options;
    this.loading = false;
    this.currentResult = new Subject<boolean>();
    return this.currentResult.asObservable();
  }

  confirm(): void {
    if (this.loading || !this.currentResult) {
      return;
    }

    this.currentResult.next(true);
    this.currentResult.complete();
    this.currentResult = null;
  }

  cancel(): void {
    if (this.loading || !this.currentResult) {
      return;
    }

    this.currentResult.next(false);
    this.currentResult.complete();
    this.currentResult = null;
    this.currentOptions = null;
  }

  setLoading(value: boolean): void {
    this.loading = value;
  }

  close(emitResult = false): void {
    if (this.currentResult) {
      if (emitResult) {
        this.currentResult.next(false);
      }
      this.currentResult.complete();
    }

    this.currentResult = null;
    this.currentOptions = null;
    this.loading = false;
  }
}
