import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { OrderService } from '../../services/order.service';
import { Order, OrderResponse, OrderStatus } from '../../interfaces/order.interface';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatChipsModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatTableModule,
    MatTooltipModule
  ],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  orders: OrderResponse = {
    content: [],
    totalPages: 0,
    totalElements: 0,
    size: 0,
    number: 0,
    first: true,
    last: true,
    empty: true
  };
  loading = false;
  error: string | null = null;
  currentPage = 0;
  pageSize = 10;
  userEmail: string = '';
  currentYear = new Date().getFullYear();
  currentMonth = new Date().getMonth();

  constructor(
    private orderService: OrderService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userEmail = user.email;
    }
  }

  ngOnInit(): void {
    this.loadOrders();
  }

  getCurrentUser(): string {
    return this.userEmail || 'Guest User';
  }

  loadOrders(): void {
    this.loading = true;
    this.error = null;

    this.orderService.getUserOrders(this.currentPage, this.pageSize).subscribe({
      next: (response: OrderResponse) => {
        console.log('Full orders response:', response);
        if (response.content && response.content.length > 0) {
          console.log('First order details:', response.content[0]);
          console.log('First order amount:', response.content[0].totalAmount);
          console.log('First order amount type:', typeof response.content[0].totalAmount);
        }
        this.orders = response;
        this.loading = false;
      },
      error: (error: Error) => {
        console.error('Error loading orders:', error);
        this.error = 'Failed to load orders. Please try again.';
        this.loading = false;
        this.snackBar.open(this.error, 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  hasOrders(): boolean {
    return !!(this.orders?.content?.length);
  }

  getThisMonthOrdersCount(): number {
    if (!this.orders?.content?.length) return 0;
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return this.orders.content.filter(order => {
      if (!order?.orderDate) return false;
      const orderDate = new Date(order.orderDate);
      return orderDate.getMonth() === currentMonth && 
             orderDate.getFullYear() === currentYear;
    }).length;
  }

  getTotalAmount(): number {
    if (!this.orders?.content?.length) return 0;
    return this.orders.content.reduce((total, order) => {
      return total + (order?.totalAmount || 0);
    }, 0);
  }

  canCancelOrder(order: Order): boolean {
    const cancellableStatuses: OrderStatus[] = ['PENDING', 'PROCESSING'];
    return cancellableStatuses.includes(order.status);
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getStatusClass(status: string): string {
    switch (status?.toUpperCase()) {
      case 'PENDING':
        return 'status-pending';
      case 'PROCESSING':
        return 'status-processing';
      case 'DELIVERED':
        return 'status-delivered';
      case 'CANCELLED':
        return 'status-cancelled';
      default:
        return '';
    }
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadOrders();
  }

  viewOrderDetails(orderId: number): void {
    window.location.href = `/orders/${orderId}`;
  }
}
