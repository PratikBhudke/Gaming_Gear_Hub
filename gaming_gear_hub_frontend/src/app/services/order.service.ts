import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order, OrderRequest, OrderResponse } from '../interfaces/order.interface';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:8080/api/orders';

  constructor(private http: HttpClient) { }

  createOrder(orderRequest: OrderRequest): Observable<Order> {
    return this.http.post<Order>(`${this.apiUrl}/create`, orderRequest);
  }

  getUserOrders(page: number = 0, size: number = 10): Observable<OrderResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<OrderResponse>(`${this.apiUrl}/user`, { params });
  }

  getOrderById(orderId: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${orderId}`);
  }

  getOrderDetails(orderId: number): Observable<Order> {
    return this.getOrderById(orderId);
  }

  cancelOrder(orderId: number): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${orderId}/cancel`, {});
  }

  // Admin endpoints
  getAllOrders(page: number = 0, size: number = 10): Observable<OrderResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<OrderResponse>(`${this.apiUrl}/admin`, { params });
  }

  updateOrderStatus(orderId: number, status: string): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/admin/${orderId}/status`, { status });
  }

  getOrdersByStatus(status: string, page: number = 0, size: number = 10): Observable<OrderResponse> {
    const params = new HttpParams()
      .set('status', status)
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<OrderResponse>(`${this.apiUrl}/admin/status`, { params });
  }
}
