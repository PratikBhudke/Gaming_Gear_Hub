package com.springboot.controller;

import com.springboot.dto.AuthRequest;
import com.springboot.dto.UserDto;
import com.springboot.entity.User;
import com.springboot.security.JwtService;
import com.springboot.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    private final UserService userService;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Autowired
    public AuthController(UserService userService, JwtService jwtService, AuthenticationManager authenticationManager) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            logger.info("Registration attempt for email: {}", user.getEmail());

            // Check if user already exists
            if (userService.existsByEmail(user.getEmail())) {
                logger.warn("Registration failed - email already exists: {}", user.getEmail());
                return ResponseEntity.badRequest().body(Map.of("message", "Email already registered"));
            }

            // Set default role if not provided
            if (user.getRole() == null || user.getRole().isEmpty()) {
                user.setRole("USER");
            }
            
            User savedUser = userService.save(user);
            
            // Generate token
            String token = jwtService.generateToken(savedUser.getEmail());
            
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("user", savedUser);
            
            logger.info("Registration successful for user: {}", savedUser.getEmail());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Registration failed", e);
            return ResponseEntity.badRequest().body(Map.of("message", "Registration failed"));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        try {
            logger.info("Login attempt for email: {}", request.getEmail());
            
            // Find user first
            User user = userService.findByEmail(request.getEmail());
            if (user == null) {
                logger.error("User not found for email: {}", request.getEmail());
                return ResponseEntity.status(401).body(Map.of("message", "Invalid email or password"));
            }

            // Attempt authentication
            try {
                Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
                );

                if (authentication.isAuthenticated()) {
                    // Generate JWT token
                    String token = jwtService.generateToken(user.getEmail());

                    // Create UserDTO to avoid circular references
                    Map<String, Object> userResponse = new HashMap<>();
                    userResponse.put("id", user.getId());
                    userResponse.put("email", user.getEmail());
                    userResponse.put("name", user.getName());
                    userResponse.put("role", user.getRole());
                    userResponse.put("address", user.getAddress());
                    userResponse.put("phoneNumber", user.getPhoneNumber());

                    Map<String, Object> response = new HashMap<>();
                    response.put("token", token);
                    response.put("user", userResponse);

                    logger.info("Login successful for user: {}", request.getEmail());
                    return ResponseEntity.ok(response);
                }
            } catch (Exception e) {
                logger.error("Authentication failed for user: {}", request.getEmail(), e);
            }

            return ResponseEntity.status(401).body(Map.of("message", "Invalid email or password"));
                
        } catch (Exception e) {
            logger.error("Login failed for email: " + request.getEmail(), e);
            return ResponseEntity.status(401).body(Map.of("message", "Invalid email or password"));
        }
    }

    @GetMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String authHeader) {
        try {
            String email = jwtService.extractUsername(authHeader.substring(7));
            if (email == null) {
                return ResponseEntity.status(401).body(Map.of("valid", false));
            }

            User user = userService.findByEmail(email);
            if (user != null) {
                return ResponseEntity.ok(Map.of("valid", true));
            }

            return ResponseEntity.status(401).body(Map.of("valid", false));
        } catch (Exception e) {
            logger.error("Token validation failed", e);
            return ResponseEntity.status(401).body(Map.of("valid", false));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestParam String email, @RequestParam String newPassword) {
        try {
            User user = userService.findByEmail(email);
            if (user == null) {
                return ResponseEntity.badRequest().body(Map.of("message", "User not found"));
            }

            userService.updatePassword(user, newPassword);
            return ResponseEntity.ok(Map.of("message", "Password reset successfully"));
        } catch (Exception e) {
            logger.error("Password reset failed: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("message", "Password reset failed"));
        }
    }
}
