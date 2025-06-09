package com.springboot;

import com.springboot.entity.Product;
import com.springboot.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.List;

@SpringBootApplication
public class GamingGearHubApplication implements CommandLineRunner {

    @Autowired
    private ProductRepository productRepository;

    public static void main(String[] args) {
        SpringApplication.run(GamingGearHubApplication.class, args);
    }

    @Override
    public void run(String... args) {
        System.out.println("\n=== CATEGORY CHECK ===");
        List<Product> products = productRepository.findAll();
        products.forEach(p -> {
            System.out.println(String.format(
                "Category in DB: '%s'",
                p.getCategory()
            ));
        });
        System.out.println("=== END CATEGORY CHECK ===\n");
    }
}
