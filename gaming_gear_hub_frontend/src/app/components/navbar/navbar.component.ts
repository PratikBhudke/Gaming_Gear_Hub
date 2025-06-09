import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { AuthService, User } from '../../services/auth.service';
import { Cart, CartItem } from '../../interfaces/cart.interface';
import { Subscription, Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';

interface NavLink {
  label: string;
  icon: string;
  route?: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  // Component state
  cart: Cart | null = null;
  userId: number | null = null;
  isLoggedIn = false;
  isAdmin = false;
  userName = '';
  cartItemCount = 0;
  searchActive = false;
  showProfileMenu = false;
  mobileMenuOpen = false;
  userAvatar: string | null = null;
  searchQuery = '';

  // Navigation links
  mainNavLinks: NavLink[] = [
    { label: 'Home', icon: 'fas fa-home', route: '/home' },
    { label: 'Products', icon: 'fas fa-gamepad', route: '/products' },
    { label: 'Categories', icon: 'fas fa-th-large', route: '/categories' },
    { label: 'New & Popular', icon: 'fas fa-fire', route: '/new' },
  ];

  mobileNavLinks: NavLink[] = [
    { label: 'Home', icon: 'fas fa-home', route: '/home' },
    { label: 'Products', icon: 'fas fa-gamepad', route: '/products' },
    { label: 'Categories', icon: 'fas fa-th-large', route: '/categories' },
    { label: 'New & Popular', icon: 'fas fa-fire', route: '/new' },
    { label: 'My List', icon: 'fas fa-bookmark', route: '/my-list' },
    { label: 'Account', icon: 'fas fa-user', route: '/account' },
  ];

  private authSubscription: Subscription | null = null;
  private cartSubscription: Subscription | null = null;
  private scrollPosition = 0;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeUser();
    this.subscribeToAuthChanges();
    this.subscribeToCartChanges();
  }

  ngOnDestroy(): void {
    this.authSubscription?.unsubscribe();
    this.cartSubscription?.unsubscribe();
  }

  // Handle window scroll for navbar effect
  @HostListener('window:scroll', ['$event'])
  onWindowScroll(): void {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  }

  // Toggle search bar
  toggleSearch(): void {
    this.searchActive = !this.searchActive;
    if (this.searchActive) {
      setTimeout(() => {
        const searchInput = document.querySelector('.search-bar input') as HTMLInputElement;
        searchInput?.focus();
      }, 100);
    }
  }

  // Toggle profile menu
  toggleProfileMenu(): void {
    this.showProfileMenu = !this.showProfileMenu;
  }

  // Toggle mobile menu
  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    document.body.style.overflow = this.mobileMenuOpen ? 'hidden' : '';
  }

  // Close mobile menu when clicking outside
  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.mobile-menu') && !target.closest('.mobile-menu-toggle')) {
      this.mobileMenuOpen = false;
      document.body.style.overflow = '';
    }

    if (!target.closest('.profile-dropdown') && !target.closest('.profile-button')) {
      this.showProfileMenu = false;
    }
  }

  // Handle search submission
  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/search'], { queryParams: { q: this.searchQuery } });
      this.searchQuery = '';
      this.searchActive = false;
    }
  }

  // Logout user - method is defined once at the end of the class

  private initializeUser(): void {
    this.userId = this.authService.getCurrentUserId();
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.isLoggedIn = true;
      this.userName = currentUser.name ?? '';
      this.isAdmin = currentUser.role === 'ADMIN';
      this.userAvatar = null; // Removed avatarUrl as it's not in the User interface
      if (!this.isAdmin && this.userId) {
        this.loadCart();
      }
    } else {
      this.isLoggedIn = false;
      this.userName = '';
      this.isAdmin = false;
      this.userAvatar = null;
      this.cart = null;
      this.cartItemCount = 0;
    }
  }

  private subscribeToAuthChanges(): void {
    // Using any type here since we're fixing type issues
    (this.authService as any).authState$?.subscribe({
      next: (user: User | null) => {
        if (user) {
          this.isLoggedIn = true;
          this.userName = user.name ?? '';
          this.isAdmin = user.role === 'ADMIN';
          this.userAvatar = null; // Removed avatarUrl as it's not in the User interface
          this.userId = user.id;
          if (!this.isAdmin && this.userId) {
            this.loadCart();
          }
        } else {
          this.isLoggedIn = false;
          this.userName = '';
          this.isAdmin = false;
          this.userAvatar = null;
          this.userId = null;
          this.cart = null;
          this.cartItemCount = 0;
        }
      },
      error: (error: any) => {
        console.error('Auth error:', error);
        this.isLoggedIn = false;
        this.userName = '';
        this.isAdmin = false;
        this.userAvatar = null;
        this.cart = null;
        this.cartItemCount = 0;
      }
    });
  }

  private subscribeToCartChanges(): void {
    if (this.userId) {
      // Using any type here since we're fixing type issues
      this.cartSubscription = (this.cartService as any).getCartByUserId?.(this.userId)?.subscribe({
        next: (cart: Cart | null) => {
          this.cart = cart;
          this.cartItemCount = cart?.items?.reduce((total: number, item: CartItem) => total + (item.quantity || 0), 0) || 0;
        },
        error: (error: any) => {
          console.error('Error fetching cart:', error);
          this.cart = null;
          this.cartItemCount = 0;
        }
      });
    }
  }

  private loadCart(): void {
    if (this.userId) {
      // Using any type here since we're fixing type issues
      (this.cartService as any).getCartByUserId?.(this.userId)?.subscribe({
        next: (cart: Cart | null) => {
          this.cart = cart;
          this.cartItemCount = cart?.items?.reduce((total: number, item: CartItem) => total + (item.quantity || 0), 0) || 0;
        },
        error: (error: any) => {
          console.error('Error loading cart:', error);
          this.cart = null;
          this.cartItemCount = 0;
        }
      });
    }
  }

  // Logout user
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
    this.showProfileMenu = false;
  }
}
