import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { CartService } from '../../services/cart.service';
import { Cart, CartItem } from '../../interfaces/cart.interface';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatDividerModule
  ]
})
export class CartComponent implements OnInit {
  cart: Cart | null = null;
  loading = false;
  error: string | null = null;
  readonly FREE_SHIPPING_THRESHOLD = 100;
  readonly SHIPPING_FEE = 10;

  constructor(
    private cartService: CartService,
    private router: Router,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  private getUserId(): number {
    const userId = this.authService.getCurrentUserId();
    if (userId === null) {
      this.router.navigate(['/login']);
      throw new Error('User not logged in');
    }
    return userId;
  }

  loadCart(): void {
    try {
      this.loading = true;
      this.error = null;
      const userId = this.getUserId();
      
      this.cartService.getCart(userId).subscribe({
        next: (cart) => {
          this.cart = cart;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading cart:', error);
          this.error = 'Failed to load your gaming arsenal. Please try again.';
          this.loading = false;
        }
      });
    } catch (error) {
      this.loading = false;
      this.error = 'Please log in to view your gaming arsenal.';
    }
  }

  updateQuantity(productId: number, newQuantity: number): void {
    if (this.loading || !productId || newQuantity < 1) return;
    
    try {
      const userId = this.getUserId();
      this.loading = true;
      this.cartService.updateQuantity(userId, productId, newQuantity).subscribe({
        next: (updatedCart) => {
          this.cart = updatedCart;
          this.loading = false;
          this.snackBar.open('Quantity updated!', 'Close', {
            duration: 2000,
            panelClass: ['success-snackbar']
          });
        },
        error: (error) => {
          console.error('Error updating quantity:', error);
          this.error = 'Failed to update quantity. Please try again.';
          this.loading = false;
          this.snackBar.open('Failed to update quantity', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
    } catch (error) {
      this.loading = false;
      this.snackBar.open('Please log in to update your gaming arsenal', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    }
  }

  getItemCount(): number {
    if (!this.cart?.items?.length) return 0;
    return this.cart.items.reduce((total, item) => total + item.quantity, 0);
  }

  trackByItemId(index: number, item: any): number {
    return item.id || index;
  }

  removeItem(productId: number): void {
    if (this.loading || !productId) return;
    
    try {
      const userId = this.getUserId();
      this.loading = true;
      this.cartService.removeFromCart(userId, productId).subscribe({
        next: (updatedCart) => {
          this.cart = updatedCart;
          this.loading = false;
          this.snackBar.open('Item removed from your arsenal', 'Close', {
            duration: 2000,
            panelClass: ['success-snackbar']
          });
        },
        error: (error) => {
          console.error('Error removing item:', error);
          this.error = 'Failed to remove item. Please try again.';
          this.loading = false;
          this.snackBar.open('Failed to remove item', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
    } catch (error) {
      this.loading = false;
      this.snackBar.open('Please log in to modify your gaming arsenal', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    }
  }

  clearCart(): void {
    if (this.loading) return;
    
    if (confirm('Are you sure you want to clear your gaming arsenal?')) {
      try {
        const userId = this.getUserId();
        this.loading = true;
        this.cartService.clearCart(userId).subscribe({
          next: () => {
            this.cart = {
              id: 0,
              userId: userId,
              items: [],
              totalAmount: 0
            };
            this.loading = false;
            this.snackBar.open('Gaming arsenal cleared', 'Close', {
              duration: 2000,
              panelClass: ['success-snackbar']
            });
          },
          error: (error) => {
            console.error('Error clearing cart:', error);
            this.error = 'Failed to clear your arsenal. Please try again.';
            this.loading = false;
            this.snackBar.open('Failed to clear arsenal', 'Close', {
              duration: 3000,
              panelClass: ['error-snackbar']
            });
          }
        });
      } catch (error) {
        this.loading = false;
        this.snackBar.open('Please log in to clear your gaming arsenal', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    }
  }

  checkout(): void {
    if (this.loading || !this.cart?.items?.length) {
      return;
    }
    
    try {
      this.getUserId(); // Check if user is logged in
      this.router.navigate(['/checkout']);
    } catch (error) {
      this.snackBar.open('Please log in to proceed to checkout', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    }
  }

  getItemTotal(item: CartItem | undefined): number {
    return item ? item.price * item.quantity : 0;
  }

  getSubtotal(): number {
    if (!this.cart?.items?.length) return 0;
    return this.cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  getShippingFee(): number {
    return this.getSubtotal() >= this.FREE_SHIPPING_THRESHOLD ? 0 : this.SHIPPING_FEE;
  }

  getTotal(): number {
    const subtotal = this.getSubtotal();
    const shipping = this.getShippingFee();
    return subtotal + shipping;
  }

  getFreeShippingProgress(): number {
    const subtotal = this.getSubtotal();
    if (subtotal >= this.FREE_SHIPPING_THRESHOLD) return 100;
    return (subtotal / this.FREE_SHIPPING_THRESHOLD) * 100;
  }

  getAmountToFreeShipping(): number {
    const subtotal = this.getSubtotal();
    if (subtotal >= this.FREE_SHIPPING_THRESHOLD) return 0;
    return this.FREE_SHIPPING_THRESHOLD - subtotal;
  }

  isCartEmpty(): boolean {
    return !this.cart?.items?.length;
  }
}
