import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AdminService, Product } from '../../../services/admin.service';
import { forkJoin, interval, Subscription } from 'rxjs';
import { startWith, switchMap, map } from 'rxjs/operators';

interface User {
  id: number;
  username: string;
  email: string;
  roles: string[];
}

interface DashboardStats {
  totalProducts: number;
  totalUsers: number;
  totalRevenue: number;
  productsByCategory: { [key: string]: number };
  topSellingProducts: Product[];
}

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatTableModule
  ]
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  stats: DashboardStats = {
    totalProducts: 0,
    totalUsers: 0,
    totalRevenue: 0,
    productsByCategory: {},
    topSellingProducts: []
  };

  refreshSubscription?: Subscription;

  constructor(
    private adminService: AdminService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.setupAutoRefresh();
  }

  ngOnDestroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  setupAutoRefresh(): void {
    this.refreshSubscription = interval(30000).pipe(
      startWith(0),
      switchMap(() => this.loadDashboardData())
    ).subscribe({
      error: (error) => {
        this.snackBar.open('Error refreshing dashboard data', 'Close', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
      }
    });
  }

  loadDashboardData() {
    return this.adminService.getDashboardStats().pipe(
      map(data => {
        this.stats = data;
        return data;
      })
    );
  }

  navigateToUsers() {
    this.router.navigate(['/admin/users']);
  }

  navigateToProducts() {
    this.router.navigate(['/admin/products']);
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  }
}
