package com.springboot.service;

import com.springboot.dto.CartDto;
import com.springboot.entity.Cart;

public interface CartService {
    CartDto addToCart(Long userId, Long productId, Integer quantity);
    CartDto removeFromCart(Long userId, Long productId);
    CartDto getCart(Long userId);
    Cart getCartEntity(Long userId);
    CartDto updateCartItemQuantity(Long userId, Long productId, Integer quantity);
    void clearCart(Long userId);
}
