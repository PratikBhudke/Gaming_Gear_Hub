export interface CartItem {
    id: number;
    productId: number;
    productName: string;
    price: number;
    quantity: number;
    subtotal: number;
    imageUrl: string;
    category: string;
}

export interface Cart {
    id: number;
    userId: number;
    items: CartItem[];
    totalAmount: number;
}
