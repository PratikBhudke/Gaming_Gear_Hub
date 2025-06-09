export interface User {
    id: number;
    name: string;
    email: string;
    role: 'USER' | 'ADMIN';
    address: string;
    phoneNumber: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface UserResponse {
    content: User[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
}

export interface DashboardStats {
    totalUsers: number;
    totalOrders: number;
    totalRevenue: number;
    recentOrders: Order[];
    topProducts: {
        productId: number;
        productName: string;
        totalSales: number;
    }[];
}
