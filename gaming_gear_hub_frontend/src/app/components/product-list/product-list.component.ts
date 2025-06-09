import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { ProductService } from '../../services/product.service';
import { Product, ProductResponse } from '../../interfaces/product.interface';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MatSnackBarModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  categoryId: string = '';
  categoryName: string = '';
  products: Product[] = [];
  loading: boolean = true;
  addingToCart: { [key: number]: boolean } = {};
  currentPage: number = 0;
  pageSize: number = 12;
  totalPages: number = 0;
  totalElements: number = 0;

  constructor(
    private route: ActivatedRoute,
    private cartService: CartService,
    private authService: AuthService,
    private productService: ProductService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.categoryId = params['id'];
      this.categoryName = this.getCategoryName(this.categoryId);
      this.loadProducts();
    });
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getProductsByCategory(this.categoryId, this.currentPage, this.pageSize)
      .subscribe({
        next: (response: ProductResponse) => {
          this.products = response.content;
          this.totalPages = response.totalPages;
          this.totalElements = response.totalElements;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading products:', error);
          this.loading = false;
          this.snackBar.open('Error loading products. Please try again later.', 'Close', {
            duration: 3000
          });
        }
      });
  }

  addToCart(product: Product): void {
    const userId = this.authService.getCurrentUserId();
    if (!userId) {
      this.snackBar.open('Please log in to add items to cart', 'Close', {
        duration: 3000
      });
      return;
    }

    this.addingToCart[product.id] = true;

    this.cartService.addToCart(userId, product.id, 1).subscribe({
      next: () => {
        this.snackBar.open('Product added to cart', 'Close', {
          duration: 2000
        });
        this.addingToCart[product.id] = false;
      },
      error: (error) => {
        console.error('Error adding to cart:', error);
        this.snackBar.open('Error adding product to cart. Please try again.', 'Close', {
          duration: 3000
        });
        this.addingToCart[product.id] = false;
      }
    });
  }

  private getCategoryName(categoryId: string): string {
    // Category mapping with exact database values
    const categoryMap: { [key: string]: string } = {
      'KEYBOARD': 'Gaming Keyboards',
      'MICE': 'Gaming Mice',
      'HEADSET': 'Gaming Headsets',
      'CONTROLLER': 'Game Controllers',
      'CPU': 'Gaming CPUs',
      'MONITOR': 'Gaming Monitors'
    };
    return categoryMap[categoryId.toUpperCase()] || 'Products';
  }
}
