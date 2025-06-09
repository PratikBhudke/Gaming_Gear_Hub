import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  discount?: number;
  rating?: number;
  stock?: number;
  brand?: string;
  features?: string[];
}

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    MatSnackBarModule
  ],
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  categoryId: string = '';
  categoryName: string = '';
  products: Product[] = [];

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router,
    private cartService: CartService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.categoryId = params['id'];
      this.updateCategoryName();
      this.loadProducts();
      // Add viewport scrolling to top when category changes
      window.scrollTo(0, 0);
    });
  }

  private loadProducts() {
    this.productService.getProductsByCategory(this.categoryId).subscribe({
      next: (response: any) => {
        // Map the response to our Product interface
        this.products = response.content.map((product: any) => {
          // Map imageUrl to image if needed
          const productImage = product.image || product.imageUrl || 'assets/images/placeholder-product.jpg';
          
          return {
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            image: productImage,
            category: product.category,
            discount: Math.random() > 0.5 ? Math.floor(Math.random() * 21) + 10 : 0, // 0 or 10-30%
            rating: Math.floor(Math.random() * 3) + 3, // 3-5 stars
            stock: Math.floor(Math.random() * 50) + 5, // 5-55 in stock
            brand: product.brand || 'Gaming Gear Hub',
            features: product.features || []
          } as Product;
        });
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.snackBar.open('Failed to load products. Please try again later.', 'Dismiss', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  addToCart(product: Product) {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || !currentUser.id) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }

    this.cartService.addToCart(currentUser.id, product.id, 1).subscribe({
      next: () => {
        const snackBarRef = this.snackBar.open('Added to cart!', 'View Cart', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        
        snackBarRef.onAction().subscribe(() => {
          this.router.navigate(['/cart']);
        });
      },
      error: (error) => {
        console.error('Error adding to cart:', error);
        let errorMessage = 'Failed to add item to cart';
        
        if (error.status === 401) {
          errorMessage = 'Please log in to add items to cart';
          this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
        }
        
        this.snackBar.open(errorMessage, 'Dismiss', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  viewDetails(product: Product) {
    this.router.navigate(['/products', product.id]);
  }

  private updateCategoryName() {
    const categoryMap: { [key: string]: string } = {
      'keyboards': 'Gaming Keyboards',
      'keyboard': 'Gaming Keyboards',
      'mice': 'Gaming Mice',
      'mouse': 'Gaming Mice',
      'headsets': 'Gaming Headsets',
      'headset': 'Gaming Headsets',
      'monitors': 'Gaming Monitors',
      'monitor': 'Gaming Monitors',
      'controllers': 'Gaming Controllers',
      'controller': 'Gaming Controllers',
      'cpu': 'Gaming CPUs',
      'processors': 'Gaming CPUs',
      'processor': 'Gaming CPUs'
    };
    
    // Convert to lowercase and remove any trailing slashes or spaces
    const normalizedId = this.categoryId.toLowerCase().trim();
    this.categoryName = categoryMap[normalizedId] || this.formatCategoryName(this.categoryId);
  }
  
  private formatCategoryName(categoryId: string): string {
    // Convert from kebab-case or snake_case to Title Case
    return categoryId
      .toLowerCase()
      .split(/[-_\s]+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
