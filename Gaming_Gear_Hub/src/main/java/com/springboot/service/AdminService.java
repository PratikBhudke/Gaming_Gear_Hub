package com.springboot.service;

import com.springboot.dto.DashboardStatsDto;
import com.springboot.dto.ProductDto;
import com.springboot.dto.UserDto;
import com.springboot.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Map;

public interface AdminService {
    // Dashboard
    DashboardStatsDto getDashboardStats();
    
    // User Management
    List<UserDto> getAllUsers();
    Page<UserDto> getUsers(Pageable pageable);
    void deleteUser(Long userId);
    
    // Product Management
    Page<ProductDto> getProducts(Pageable pageable);
    ProductDto addProduct(Product product);
    ProductDto updateProduct(Long productId, Product product);
    void deleteProduct(Long productId);
    Map<String, Long> getProductsByCategory();
    List<ProductDto> getTopSellingProducts(int limit);
}
