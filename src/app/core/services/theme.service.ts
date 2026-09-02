import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  isDark = false;
  private readonly storageKey = 'smart_blood_bank_theme';

  constructor() {
    const saved = localStorage.getItem(this.storageKey);
    this.isDark = saved === 'dark';
    this.applyTheme();
  }

  toggleTheme(): void {
    this.isDark = !this.isDark;
    localStorage.setItem(this.storageKey, this.isDark ? 'dark' : 'light');
    this.applyTheme();
  }

  private applyTheme(): void {
    document.body.classList.toggle('dark-theme', this.isDark);
    document.documentElement.setAttribute('data-theme', this.isDark ? 'dark' : 'light');
  }
}
