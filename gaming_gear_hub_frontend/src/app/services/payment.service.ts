import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface OrderRequest {
  customerName: string;
  email: string;
  phoneNumber: string;
  amount: number;
  currency: string;
  address: string;
  cartId: number;
  items: Array<{
    productId: number;
    quantity: number;
    price: number;
  }>;
}

interface PaymentVerification {
  orderId: string;
  paymentId: string;
  signature: string;
}

interface PaymentResponse {
  status: string;
  orderId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = 'http://localhost:8080/api/payment';

  constructor(private http: HttpClient) { }

  createOrder(orderRequest: OrderRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/create-order`, orderRequest);
  }

  verifyPayment(verification: PaymentVerification): Observable<PaymentResponse> {
    // Using GET request as per the backend controller
    return this.http.post<PaymentResponse>(`${this.apiUrl}/verify`, null, {
      params: {
        orderId: verification.orderId,
        paymentId: verification.paymentId,
        signature: verification.signature
      }
    });
  }

  loadRazorpayScript(): Promise<boolean> {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      document.body.appendChild(script);
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
    });
  }
}
