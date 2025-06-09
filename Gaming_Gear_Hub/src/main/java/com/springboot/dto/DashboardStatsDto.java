package com.springboot.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public class DashboardStatsDto {
    private Long totalUsers;
    private Long totalProducts;
    private Map<String, Long> productsByCategory;
    private Double totalRevenue;
    private List<ProductDto> topSellingProducts;

    public DashboardStatsDto() {
        this.totalRevenue = 0.0;
    }

    public DashboardStatsDto(Long totalUsers, Long totalProducts, Map<String, Long> productsByCategory,
                            Double totalRevenue, List<ProductDto> topSellingProducts) {
        this.totalUsers = totalUsers;
        this.totalProducts = totalProducts;
        this.productsByCategory = productsByCategory;
        this.totalRevenue = totalRevenue != null ? totalRevenue : 0.0;
        this.topSellingProducts = topSellingProducts;
    }

    public Long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(Long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public Long getTotalProducts() {
        return totalProducts;
    }

    public void setTotalProducts(Long totalProducts) {
        this.totalProducts = totalProducts;
    }

    public Map<String, Long> getProductsByCategory() {
        return productsByCategory;
    }

    public void setProductsByCategory(Map<String, Long> productsByCategory) {
        this.productsByCategory = productsByCategory;
    }

    public Double getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(Double totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public List<ProductDto> getTopSellingProducts() {
        return topSellingProducts;
    }

    public void setTopSellingProducts(List<ProductDto> topSellingProducts) {
        this.topSellingProducts = topSellingProducts;
    }
}
