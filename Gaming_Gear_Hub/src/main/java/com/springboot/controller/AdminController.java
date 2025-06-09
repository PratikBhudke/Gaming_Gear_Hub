package com.springboot.controller;

import com.springboot.dto.DashboardStatsDto;
import com.springboot.dto.ProductDto;
import com.springboot.dto.UserDto;
import com.springboot.entity.Product;
import com.springboot.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasAuthority('ADMIN')")
@CrossOrigin(origins = "http://localhost:4200")
public class AdminController {

    private final AdminService adminService;

    @Autowired
    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    // Dashboard Statistics
    @GetMapping("/dashboard/stats")
    public ResponseEntity<DashboardStatsDto> getDashboardStats() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    // User Management
    @GetMapping("/users")
    public ResponseEntity<Page<UserDto>> getUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(adminService.getUsers(PageRequest.of(page, size)));
    }

    @GetMapping("/users/all")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long userId) {
        adminService.deleteUser(userId);
        return ResponseEntity.ok().build();
    }

    // Product Management
    @GetMapping("/products")
    public ResponseEntity<Page<ProductDto>> getProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(adminService.getProducts(PageRequest.of(page, size)));
    }

    @PostMapping("/products")
    public ResponseEntity<ProductDto> addProduct(@RequestBody Product product) {
        return ResponseEntity.ok(adminService.addProduct(product));
    }

    @PutMapping("/products/{productId}")
    public ResponseEntity<ProductDto> updateProduct(
            @PathVariable Long productId,
            @RequestBody Product product) {
        return ResponseEntity.ok(adminService.updateProduct(productId, product));
    }

    @DeleteMapping("/products/{productId}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long productId) {
        adminService.deleteProduct(productId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/products/by-category")
    public ResponseEntity<Map<String, Long>> getProductsByCategory() {
        return ResponseEntity.ok(adminService.getProductsByCategory());
    }

    @GetMapping("/products/top-selling")
    public ResponseEntity<List<ProductDto>> getTopSellingProducts(
            @RequestParam(defaultValue = "5") int limit) {
        return ResponseEntity.ok(adminService.getTopSellingProducts(limit));
    }
}
