import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  constructor(
    public authService: AuthService,
    private router: Router,
    public languageService: LanguageService
  ) {}

  toggleLanguage(): void {
    this.languageService.toggleLanguage();
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  goToAccount(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    const role = this.authService.getRole();
    if (role === 'donor') this.router.navigate(['/donor/profile']);
    else this.router.navigate(['/profile']);
  }

  goToNotifications(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    const role = this.authService.getRole();
    if (role === 'donor') this.router.navigate(['/donor/notifications']);
    else if (role === 'requester') this.router.navigate(['/requester']);
    else this.router.navigate(['/admin']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
