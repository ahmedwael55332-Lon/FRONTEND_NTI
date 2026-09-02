import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type AppLanguage = 'en' | 'ar';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly storageKey = 'smart_blood_bank_language';
  private readonly languageSubject = new BehaviorSubject<AppLanguage>(this.getInitialLanguage());
  readonly language$ = this.languageSubject.asObservable();

  get language(): AppLanguage {
    return this.languageSubject.value;
  }

  get isArabic(): boolean {
    return this.language === 'ar';
  }

  toggleLanguage(): void {
    this.setLanguage(this.language === 'en' ? 'ar' : 'en');
  }

  setLanguage(language: AppLanguage): void {
    this.languageSubject.next(language);
    localStorage.setItem(this.storageKey, language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.body.classList.toggle('rtl-layout', language === 'ar');
  }

  private getInitialLanguage(): AppLanguage {
    const saved = localStorage.getItem(this.storageKey);
    const language: AppLanguage = saved === 'ar' ? 'ar' : 'en';
    setTimeout(() => {
      document.documentElement.lang = language;
      document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
      document.body.classList.toggle('rtl-layout', language === 'ar');
    });
    return language;
  }
}
