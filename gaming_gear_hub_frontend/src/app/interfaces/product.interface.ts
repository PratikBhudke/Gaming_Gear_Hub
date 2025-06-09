export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
    brand: string;
    imageUrl: string;
    isWireless: boolean;
    compatibility: string;
    rating: number;
}

export interface ProductResponse {
    content: Product[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
}
