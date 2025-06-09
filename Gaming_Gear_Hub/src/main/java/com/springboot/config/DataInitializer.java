package com.springboot.config;

import com.springboot.entity.User;
import com.springboot.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // Create admin user if not exists
        if (!userRepository.findByEmail("vivek.chopade18@gmail.com").isPresent()) {
            User adminUser = new User();
            adminUser.setName("Vivek");
            adminUser.setEmail("vivek.chopade18@gmail.com");
            adminUser.setPassword(passwordEncoder.encode("vivek@2002"));
            adminUser.setRole("ADMIN");
            adminUser.setPhoneNumber("9876543210");
            adminUser.setAddress("Pune");
            
            userRepository.save(adminUser);
            System.out.println("Admin user created successfully!");
        }
    }
}
