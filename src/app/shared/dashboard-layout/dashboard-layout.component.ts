import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService } from '../../core/services/theme.service';
import { AuthService } from '../../core/services/auth.service';
import { LanguageService } from '../../core/services/language.service';

export interface DashboardNavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-dashboard-layout',
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.css']
})
export class DashboardLayoutComponent {

  @Input() title = 'Portal';
  @Input() subtitle = '';
  @Input() navItems: DashboardNavItem[] = [];

  constructor(
    private router: Router,
    public themeService: ThemeService,
    private authService: AuthService,
    public languageService: LanguageService
  ) {}

  get profileRoute(): string {
    if (this.title.toLowerCase().includes('donor')) {
      return '/donor/profile';
    }

    if (this.title.toLowerCase().includes('requester')) {
      return '/profile';
    }

    if (this.title.toLowerCase().includes('admin')) {
      return '/profile';
    }

    return '/profile';
  }

  get dashboardRoute(): string {
    const role = this.authService.getRole();
    if (role === 'donor') return '/donor';
    if (role === 'requester') return '/requester';
    return '/admin';
  }

  toggleLanguage(): void {
    this.languageService.toggleLanguage();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  openNotifications(): void {
    const title = this.title.toLowerCase();

    if (title.includes('donor')) {
      this.router.navigate(['/donor/notifications']);
      return;
    }

    if (title.includes('requester')) {
      this.router.navigate(['/requester/blood-requests']);
      return;
    }

    this.router.navigate(['/admin/blood-requests']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}