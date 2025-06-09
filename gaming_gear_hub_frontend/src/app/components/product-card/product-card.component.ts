import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { Product } from '../../interfaces/product.interface';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule, MatSnackBarModule],
  template: `
    <div class="product-card">
      <img [src]="product.imageUrl" [alt]="product.name" class="product-image">
      <div class="product-info">
        <h3 class="product-name">{{product.name}}</h3>
        <p class="product-description">{{product.description}}</p>
        <div class="product-price">${{product.price}}</div>
        <button *ngIf="isLoggedIn" 
                class="add-to-cart-btn" 
                (click)="addToCart()"
                [disabled]="isAddingToCart">
          <i class="fas" [class.fa-cart-plus]="!isAddingToCart" [class.fa-spinner]="isAddingToCart"></i>
          {{isAddingToCart ? 'Adding...' : 'Add to Cart'}}
        </button>
        <button *ngIf="!isLoggedIn" 
                class="login-btn" 
                routerLink="/auth/login">
          Login to Purchase
        </button>
      </div>
    </div>
  `,
  styles: [`
    .product-card {
      background: #2a2a2a;
      border-radius: 8px;
      overflow: hidden;
      transition: transform 0.2s;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

      &:hover {
        transform: translateY(-5px);
      }

      .product-image {
        width: 100%;
        height: 200px;
        object-fit: cover;
      }

      .product-info {
        padding: 1rem;

        .product-name {
          margin: 0 0 0.5rem;
          color: white;
          font-size: 1.2rem;
        }

        .product-description {
          color: #ccc;
          margin: 0 0 1rem;
          font-size: 0.9rem;
          line-height: 1.4;
        }

        .product-price {
          color: #00ff9d;
          font-size: 1.5rem;
          font-weight: bold;
          margin-bottom: 1rem;
        }

        .add-to-cart-btn, .login-btn {
          width: 100%;
          padding: 0.75rem;
          border: none;
          border-radius: 4px;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: background-color 0.2s;

          i {
            font-size: 1.1rem;
          }

          &:disabled {
            opacity: 0.7;
            cursor: not-allowed;
          }
        }

        .add-to-cart-btn {
          background: #00ff9d;
          color: #1a1a1a;

          &:hover:not(:disabled) {
            background: #00cc7d;
          }

          .fa-spinner {
            animation: spin 1s linear infinite;
          }
        }

        .login-btn {
          background: #2a2a2a;
          color: #00ff9d;
          border: 2px solid #00ff9d;

          &:hover {
            background: #00ff9d;
            color: #1a1a1a;
          }
        }
      }
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `]
})
export class ProductCardComponent implements OnInit {
  @Input() product!: Product;
  isAddingToCart = false;
  isLoggedIn = false;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
    });
  }

  addToCart(): void {
    if (!this.isLoggedIn) {
      this.snackBar.open('Please login to add items to cart', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      });
      return;
    }

    const userId = this.authService.getCurrentUserId();
    if (!userId) {
      this.snackBar.open('Unable to add to cart. Please try logging in again.', 'Close', {
        duration: 3000,
      });
      return;
    }

    this.isAddingToCart = true;
    this.cartService.addToCart(userId, this.product.id, 1).subscribe({
      next: (cart) => {
        this.isAddingToCart = false;
        this.snackBar.open('Added to cart!', 'Close', {
          duration: 2000,
          panelClass: ['success-snackbar']
        });
      },
      error: (error) => {
        console.error('Error adding to cart:', error);
        this.isAddingToCart = false;
        this.snackBar.open('Failed to add to cart. Please try again.', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }
}
