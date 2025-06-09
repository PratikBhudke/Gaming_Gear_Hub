package com.springboot.service;

import com.springboot.dto.ProductDto;
import com.springboot.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface ProductService {
    ProductDto createProduct(Product product);
    ProductDto getProductById(Long id);
    Page<ProductDto> getAllProducts(Pageable pageable);
    ProductDto updateProduct(Long id, Product product);
    void deleteProduct(Long id);
    Page<ProductDto> getProductsByCategory(String category, Pageable pageable);
    List<ProductDto> searchProducts(String keyword);
    List<String> getAllUniqueCategories();
    List<ProductDto> getAllProductsNoPage();
}