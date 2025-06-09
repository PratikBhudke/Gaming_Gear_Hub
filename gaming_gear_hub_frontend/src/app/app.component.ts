import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd, ActivatedRoute } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AdminNavbarComponent } from './components/admin/admin-navbar/admin-navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { AuthService, User } from './services/auth.service';
import { filter, map, mergeMap } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NavbarComponent,
    AdminNavbarComponent,
    FooterComponent,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Gaming Gear Hub';
  currentYear: number;
  showNavbarAndFooter = true;
  private routerSubscription: Subscription | undefined;
  private authSubscription: Subscription | undefined;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService
  ) {
    this.currentYear = new Date().getFullYear();
  }

  ngOnInit(): void {
    // Check route changes to determine if we should show navbar and footer
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.activatedRoute),
      map(route => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
      filter(route => route.outlet === 'primary'),
      mergeMap(route => route.data)
    ).subscribe(data => {
      // Check if the current route is an admin route
      const isAdminRoute = this.router.url.startsWith('/admin');
      
      // Check if user is admin
      const currentUser = this.authService.getCurrentUser();
      const isAdmin = currentUser?.role === 'ADMIN';
      
      // Show navbar and footer unless we're on an admin route and user is admin
      this.showNavbarAndFooter = !(isAdminRoute && isAdmin);
    });

    // Also check on auth state changes
    this.authSubscription = this.authService.currentUser$.subscribe((user: User | null) => {
      const isAdminRoute = this.router.url.startsWith('/admin');
      const isAdmin = user?.role === 'ADMIN';
      this.showNavbarAndFooter = !(isAdminRoute && isAdmin);
    });
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  // Check if the current user is an admin
  isUserAdmin(): boolean {
    const user = this.authService.getCurrentUser();
    return user?.role === 'ADMIN';
  }
}
