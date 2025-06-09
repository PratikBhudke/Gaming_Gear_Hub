import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUserShield, faTachometerAlt, faBox, faShoppingCart, faUsers, faTags, faUserCog, faStore, faSignOutAlt, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../../services/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink, FontAwesomeModule],
  selector: 'app-admin-navbar',
  templateUrl: './admin-navbar.component.html',
  styleUrls: ['./admin-navbar.component.scss']
})
export class AdminNavbarComponent implements OnInit {
  // Icons
  faUserShield = faUserShield;
  faTachometerAlt = faTachometerAlt;
  faBox = faBox;
  faShoppingCart = faShoppingCart;
  faUsers = faUsers;
  faTags = faTags;
  faUserCog = faUserCog;
  faStore = faStore;
  faSignOutAlt = faSignOutAlt;
  faCaretDown = faCaretDown;

  // Component state
  showUserMenu = false;
  userName: string = '';
  userEmail: string = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Get current user info
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userName = user.name || 'Admin';
      this.userEmail = user.email || 'admin@example.com';
    }
  }

  // Toggle user menu
  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  // Check if route is active
  isActive(route: string): boolean {
    return this.router.url.includes(route);
  }

  // Handle logout
  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  // Close dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.admin-user-menu')) {
      this.showUserMenu = false;
    }
  }

}
