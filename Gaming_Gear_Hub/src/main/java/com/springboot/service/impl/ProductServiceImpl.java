package com.springboot.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.springboot.dto.ProductDto;
import com.springboot.entity.Product;
import com.springboot.exception.ResourceNotFoundException;
import com.springboot.repository.ProductRepository;
import com.springboot.service.ProductService;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Override
    public ProductDto createProduct(Product product) {
        Product savedProduct = productRepository.save(product);
        return convertToDto(savedProduct);
    }

    @Override
    public ProductDto getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        return convertToDto(product);
    }

    @Override
    public Page<ProductDto> getAllProducts(Pageable pageable) {
        return productRepository.findAll(pageable).map(this::convertToDto);
    }

    @Override
    public ProductDto updateProduct(Long id, Product productDetails) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        product.setName(productDetails.getName());
        product.setDescription(productDetails.getDescription());
        product.setPrice(productDetails.getPrice());
        product.setCategory(productDetails.getCategory());
        product.setStock(productDetails.getStock());
        product.setBrand(productDetails.getBrand());
        product.setImageUrl(productDetails.getImageUrl());
        product.setWireless(productDetails.isWireless());
        product.setCompatibility(productDetails.getCompatibility());
        product.setRating(productDetails.getRating());

        Product updatedProduct = productRepository.save(product);
        return convertToDto(updatedProduct);
    }

    @Override
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product not found");
        }
        productRepository.deleteById(id);
    }

    @Override
    public Page<ProductDto> getProductsByCategory(String category, Pageable pageable) {
        System.out.println("Searching for category: '" + category + "'");
        Page<Product> products = productRepository.findByCategoryIgnoreCase(category, pageable);
        System.out.println("Found " + products.getTotalElements() + " products");
        products.getContent().forEach(p -> {
            System.out.println("Product: " + p.getName() + ", Category: '" + p.getCategory() + "'");
        });
        return products.map(this::convertToDto);
    }

    @Override
    public List<ProductDto> searchProducts(String keyword) {
        return productRepository.findByNameContainingIgnoreCase(keyword)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<String> getAllUniqueCategories() {
        return productRepository.findAll().stream()
                .map(Product::getCategory)
                .distinct()
                .sorted()
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductDto> getAllProductsNoPage() {
        List<Product> products = productRepository.findAll();
        return products.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    private ProductDto convertToDto(Product product) {
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
}
