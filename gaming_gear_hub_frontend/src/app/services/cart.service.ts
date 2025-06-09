import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Cart } from '../interfaces/cart.interface';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = `${environment.apiUrl}/cart`;
  private cartSubject = new BehaviorSubject<Cart | null>(null);
  cart$ = this.cartSubject.asObservable();

  constructor(private http: HttpClient) {}

  getCart(userId: number): Observable<Cart> {
    if (!userId) {
      return throwError(new Error('User ID is required'));
    }
    return this.http.get<Cart>(`${this.apiUrl}/${userId}`).pipe(
      tap(cart => this.cartSubject.next(cart)),
      catchError(error => {
        this.cartSubject.next(null);
        return throwError(error);
      })
    );
  }

  addToCart(userId: number, productId: number, quantity: number = 1): Observable<Cart> {
    if (!userId) {
      return throwError(() => new Error('User ID is required'));
    }
    return this.http.post<Cart>(`${this.apiUrl}/${userId}/add/${productId}?quantity=${quantity}`, {}).pipe(
      tap(cart => {
        console.log('Cart updated:', cart);
        this.cartSubject.next(cart);
      }),
      catchError(error => {
        console.error('Error adding to cart:', error);
        return throwError(() => error);
      })
    );
  }

  updateQuantity(userId: number, productId: number, quantity: number): Observable<Cart> {
    if (!userId) {
      return throwError(() => new Error('User ID is required'));
    }
    return this.http.put<Cart>(`${this.apiUrl}/${userId}/update/${productId}?quantity=${quantity}`, {}).pipe(
      tap(cart => {
        console.log('Cart updated:', cart);
        this.cartSubject.next(cart);
      }),
      catchError(error => {
        console.error('Error updating quantity:', error);
        return throwError(() => error);
      })
    );
  }

  removeFromCart(userId: number, productId: number): Observable<Cart> {
    if (!userId) {
      return throwError(new Error('User ID is required'));
    }
    return this.http.delete<Cart>(`${this.apiUrl}/${userId}/remove/${productId}`).pipe(
      tap(cart => this.cartSubject.next(cart)),
      catchError(error => {
        this.cartSubject.next(null);
        return throwError(error);
      })
    );
  }

  clearCart(userId: number): Observable<void> {
    if (!userId) {
      return throwError(new Error('User ID is required'));
    }
    return this.http.delete<void>(`${this.apiUrl}/${userId}/clear`).pipe(
      tap(() => this.cartSubject.next(null)),
      catchError(error => {
        this.cartSubject.next(null);
        return throwError(error);
      })
    );
  }
}
