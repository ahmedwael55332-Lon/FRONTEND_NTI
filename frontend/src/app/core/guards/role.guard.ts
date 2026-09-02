import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  Router
} from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {

    const allowedRoles = route.data['roles'] as string[];
    const userRole = this.authService.getRole();

    if (userRole && allowedRoles.includes(userRole)) {
      return true;
    }

    // المستخدم Logged in لكن مش مسموح له
    if (userRole === 'admin') {
      this.router.navigate(['/admin']);
    } else if (userRole === 'donor') {
      this.router.navigate(['/donor']);
    } else if (userRole === 'requester') {
      this.router.navigate(['/requester']);
    } else {
      this.router.navigate(['/']);
    }

    return false;
  }
}