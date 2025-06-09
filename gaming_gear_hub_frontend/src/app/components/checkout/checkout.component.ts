import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CartService } from '../../services/cart.service';
import { PaymentService } from '../../services/payment.service';
import { AuthService } from '../../services/auth.service';
import { Cart } from '../../interfaces/cart.interface';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

declare var Razorpay: any;

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class CheckoutComponent implements OnInit {
  cart: Cart | null = null;
  loading = false;
  error: string | null = null;
  readonly FREE_SHIPPING_THRESHOLD = 100;
  readonly SHIPPING_FEE = 10;
  checkoutForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private cartService: CartService,
    private paymentService: PaymentService,
    private router: Router,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {
    this.checkoutForm = this.formBuilder.group({
      customerName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      address: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadCart();
    this.loadUserDetails();
  }

  private loadUserDetails(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.checkoutForm.patchValue({
        customerName: user.name || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || ''
      });
    }
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

  getSubtotal(): number {
    if (!this.cart?.items?.length) return 0;
    return this.cart.totalAmount;
  }

  getShippingFee(): number {
    return this.getSubtotal() >= this.FREE_SHIPPING_THRESHOLD ? 0 : this.SHIPPING_FEE;
  }

  getTotal(): number {
    return this.getSubtotal() + this.getShippingFee();
  }

  initiatePayment(): void {
    if (this.loading || !this.cart?.items?.length || this.checkoutForm.invalid) {
      if (this.checkoutForm.invalid) {
        this.snackBar.open('Please fill in all required fields correctly', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
      return;
    }

    try {
      const userId = this.getUserId();
      this.loading = true;

      const orderRequest = {
        ...this.checkoutForm.value,
        amount: this.getTotal(),
        currency: 'INR',
        cartId: this.cart.id,
        items: this.cart.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price
        }))
      };

      this.paymentService.createOrder(orderRequest).subscribe({
        next: (response) => {
          this.loading = false;
          this.setupRazorpay(response);
        },
        error: (error) => {
          console.error('Error creating order:', error);
          this.loading = false;
          this.snackBar.open('Failed to initiate payment. Please try again.', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
    } catch (error) {
      this.loading = false;
      this.snackBar.open('Please log in to proceed with payment', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    }
  }

  private setupRazorpay(order: any): void {
    const options = {
      key: order.keyId,
      amount: order.amount,
      currency: order.currency,
      name: 'Gaming Gear Hub',
      description: 'Gaming Gear Purchase',
      order_id: order.orderId,
      handler: (response: any) => {
        this.verifyPayment(response);
      },
      prefill: {
        name: this.checkoutForm.get('customerName')?.value,
        email: this.checkoutForm.get('email')?.value,
        contact: this.checkoutForm.get('phoneNumber')?.value
      },
      theme: {
        color: '#845ec2'
      }
    };

    const rzp = new Razorpay(options);
    rzp.open();
  }

  private verifyPayment(response: any): void {
    const verificationData = {
      orderId: response.razorpay_order_id,
      paymentId: response.razorpay_payment_id,
      signature: response.razorpay_signature
    };

    this.paymentService.verifyPayment(verificationData).subscribe({
      next: (result) => {
        if (result.status === 'SUCCESS') {
          this.snackBar.open('Payment successful! Your gaming gear is on its way!', 'Close', {
            duration: 5000,
            panelClass: ['success-snackbar']
          });
          // Redirect to payment success page with details
          this.router.navigate(['/payment-success'], {
            queryParams: {
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              amount: this.getTotal()
            }
          });
        } else {
          console.error('Payment verification failed:', result);
          this.snackBar.open('Payment verification failed. Please contact support.', 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
          this.router.navigate(['/orders']);
        }
      },
      error: (error) => {
        console.error('Payment verification error:', error);
        this.snackBar.open('Error verifying payment. Please check your order status or contact support.', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        // Still navigate to orders page so user can check their order status
        this.router.navigate(['/orders']);
      }
    });
  }
}
