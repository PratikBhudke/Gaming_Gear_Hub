import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const user = this.authService.getCurrentUser();
    
    if (this.authService.isLoggedIn() && user?.role === 'ADMIN') {
      return true;
    }
    
    // If user is logged in but not admin, redirect to home
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/home']);
    } else {
      // If not logged in, redirect to login
      this.router.navigate(['/login']);
    }
    return false;
  }
}
