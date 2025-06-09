package com.springboot.service.impl;

import com.springboot.dto.DashboardStatsDto;
import com.springboot.dto.ProductDto;
import com.springboot.dto.UserDto;
import com.springboot.entity.Order;
import com.springboot.entity.Product;
import com.springboot.entity.User;
import com.springboot.repository.OrderRepository;
import com.springboot.repository.ProductRepository;
import com.springboot.repository.UserRepository;
import com.springboot.service.AdminService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;

    @Autowired
    public AdminServiceImpl(UserRepository userRepository, ProductRepository productRepository, OrderRepository orderRepository) {
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
    }

    @Override
    public DashboardStatsDto getDashboardStats() {
        long totalUsers = userRepository.count();
        long totalProducts = productRepository.count();
        Map<String, Long> productsByCategory = getProductsByCategory();
        Double totalRevenue = calculateTotalRevenue();
        List<ProductDto> topProducts = getTopSellingProducts(5); // Top 5 products
        
        DashboardStatsDto stats = new DashboardStatsDto();
        stats.setTotalUsers(totalUsers);
        stats.setTotalProducts(totalProducts);
        stats.setProductsByCategory(productsByCategory);
        stats.setTotalRevenue(totalRevenue);
        stats.setTopSellingProducts(topProducts);
        return stats;
    }

    @Override
    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::convertToUserDto)
                .collect(Collectors.toList());
    }

    @Override
    public Page<UserDto> getUsers(Pageable pageable) {
        return userRepository.findAll(pageable)
                .map(this::convertToUserDto);
    }

    @Override
    @Transactional
    public void deleteUser(Long userId) {
        userRepository.deleteById(userId);
    }

    @Override
    public Page<ProductDto> getProducts(Pageable pageable) {
        return productRepository.findAll(pageable)
                .map(this::convertToProductDto);
    }

    @Override
    public ProductDto addProduct(Product product) {
        Product savedProduct = productRepository.save(product);
        return convertToProductDto(savedProduct);
    }

    @Override
    public ProductDto updateProduct(Long productId, Product product) {
        Product existingProduct = productRepository.findById(productId)
                .orElseThrow(() -> new EntityNotFoundException("Product not found"));
        
        existingProduct.setName(product.getName());
        existingProduct.setDescription(product.getDescription());
        existingProduct.setPrice(product.getPrice());
        existingProduct.setCategory(product.getCategory());
        existingProduct.setBrand(product.getBrand());
        existingProduct.setImageUrl(product.getImageUrl());
        existingProduct.setStock(product.getStock());
        existingProduct.setWireless(product.isWireless());
        existingProduct.setCompatibility(product.getCompatibility());
        
        return convertToProductDto(productRepository.save(existingProduct));
    }

    @Override
    @Transactional
    public void deleteProduct(Long productId) {
        productRepository.deleteById(productId);
    }

    @Override
    public Map<String, Long> getProductsByCategory() {
        return productRepository.findAll().stream()
                .collect(Collectors.groupingBy(
                        Product::getCategory,
                        Collectors.counting()
                ));
    }

    @Override
    public List<ProductDto> getTopSellingProducts(int limit) {
        // Get all orders and their items
        List<Order> allOrders = orderRepository.findAll();
        
        // Create a map of product IDs to their total quantity sold
        Map<Long, Long> productSales = allOrders.stream()
                .flatMap(order -> order.getOrderItems().stream())
                .collect(Collectors.groupingBy(
                        orderItem -> orderItem.getProduct().getId(),
                        Collectors.summingLong(orderItem -> orderItem.getQuantity())
                ));
        
        // Get the top selling products
        return productSales.entrySet().stream()
                .sorted(Map.Entry.<Long, Long>comparingByValue().reversed())
                .limit(limit)
                .map(entry -> productRepository.findById(entry.getKey())
                        .map(this::convertToProductDto)
                        .orElse(null))
                .filter(dto -> dto != null)
                .collect(Collectors.toList());
    }

    private UserDto convertToUserDto(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
        dto.setAddress(user.getAddress());
        dto.setPhoneNumber(user.getPhoneNumber());
        return dto;
    }

    private ProductDto convertToProductDto(Product product) {
        return new ProductDto(
                product.getId(),
                product.getName(),
                product.getDescription(),
                product.getPrice(),
                product.getStock(),
                product.getCategory(),
                product.getBrand(),
                product.getImageUrl(),
                product.isWireless(),
                product.getCompatibility(),
                product.getRating()
        );
    }

    private Double calculateTotalRevenue() {
        return orderRepository.findAll().stream()
                .mapToDouble(Order::getTotalAmount)
                .sum();
    }
}
