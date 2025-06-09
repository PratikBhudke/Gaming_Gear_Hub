export type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';

export interface OrderItem {
  id: number;
  order?: Order;
  product: {
    id: number;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    category: string;
    stock: number;
  };
  quantity: number;
  price: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface Order {
  id: number;
  user?: User;
  orderItems: OrderItem[];
  orderDate: string;
  status: OrderStatus;
  shippingAddress: string;
  totalAmount: number;
  razorpayOrderId: string;
  razorpayPaymentId: string | null;
  razorpaySignature: string | null;
  paymentStatus: string;
  amount: number;
}

export interface OrderRequest {
  orderItems: {
    productId: number;
    quantity: number;
  }[];
  shippingAddress: string;
}

export interface OrderResponse {
  content: Order[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
  numberOfElements?: number;
}
