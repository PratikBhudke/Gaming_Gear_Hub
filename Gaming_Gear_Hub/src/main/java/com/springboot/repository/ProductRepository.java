package com.springboot.repository;

import com.springboot.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByNameContainingIgnoreCase(String name);
    
    @Query("SELECT p FROM Product p WHERE REPLACE(UPPER(TRIM(p.category)), ' ', '') = REPLACE(UPPER(TRIM(:category)), ' ', '')")
    Page<Product> findByCategoryIgnoreCase(@Param("category") String category, Pageable pageable);
}