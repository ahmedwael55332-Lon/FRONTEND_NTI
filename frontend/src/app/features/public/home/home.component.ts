import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  constructor(public authService: AuthService) {}

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  get dashboardRoute(): string {
    const role = this.authService.getRole();
    if (role === 'donor') return '/donor';
    if (role === 'requester') return '/requester';
    return '/admin';
  }

  get profileRoute(): string {
    return this.authService.getRole() === 'donor' ? '/donor/profile' : '/profile';
  }
}
