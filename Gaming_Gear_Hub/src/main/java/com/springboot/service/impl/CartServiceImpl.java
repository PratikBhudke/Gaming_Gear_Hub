package com.springboot.service.impl;

import com.springboot.dto.CartDto;
import com.springboot.dto.CartItemDto;
import com.springboot.entity.Cart;
import com.springboot.entity.CartItem;
import com.springboot.entity.Product;
import com.springboot.entity.User;
import com.springboot.repository.CartRepository;
import com.springboot.repository.ProductRepository;
import com.springboot.repository.UserRepository;
import com.springboot.service.CartService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @Autowired
    public CartServiceImpl(CartRepository cartRepository, UserRepository userRepository, ProductRepository productRepository) {
        this.cartRepository = cartRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    @Override
    @Transactional
    public CartDto addToCart(Long userId, Long productId, Integer quantity) {
        Cart cart = getOrCreateCart(userId);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new EntityNotFoundException("Product not found"));

        // Check if item already exists in cart
        CartItem cartItem = cart.getCartItems().stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst()
                .orElse(null);

        if (cartItem == null) {
            cartItem = new CartItem();
            cartItem.setCart(cart);
            cartItem.setProduct(product);
            cartItem.setPrice(product.getPrice());
            cart.addCartItem(cartItem);
        }

        cartItem.setQuantity(cartItem.getQuantity() + quantity);
        cart = cartRepository.save(cart);
        
        return convertToDto(cart);
    }

    @Override
    @Transactional
    public CartDto removeFromCart(Long userId, Long productId) {
        Cart cart = getCartEntity(userId);
        CartItem cartItem = cart.getCartItems().stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst()
                .orElseThrow(() -> new EntityNotFoundException("Product not found in cart"));

        cart.removeCartItem(cartItem);
        cart = cartRepository.save(cart);
        
        return convertToDto(cart);
    }

    @Override
    public CartDto getCart(Long userId) {
        Cart cart = getOrCreateCart(userId);
        return convertToDto(cart);
    }

    @Override
    @Transactional
    public CartDto updateCartItemQuantity(Long userId, Long productId, Integer quantity) {
        Cart cart = getCartEntity(userId);
        CartItem cartItem = cart.getCartItems().stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst()
                .orElseThrow(() -> new EntityNotFoundException("Product not found in cart"));

        cartItem.setQuantity(quantity);
        cart = cartRepository.save(cart);
        
        return convertToDto(cart);
    }

    @Override
    @Transactional
    public void clearCart(Long userId) {
        Cart cart = getCartEntity(userId);
        cart.getCartItems().clear();
        cartRepository.save(cart);
    }

    private Cart getOrCreateCart(Long userId) {
        return cartRepository.findByUserId(userId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new EntityNotFoundException("User not found"));
                    Cart newCart = new Cart();
                    newCart.setUser(user);
                    return cartRepository.save(newCart);
                });
    }

    @Override
    public Cart getCartEntity(Long userId) {
        return cartRepository.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("Cart not found"));
    }

    private CartDto convertToDto(Cart cart) {
        List<CartItemDto> cartItemDtos = cart.getCartItems().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());

        CartDto cartDto = CartDto.builder()
                .id(cart.getId())
                .userId(cart.getUser().getId())
                .items(cartItemDtos)
                .build();
        cartDto.calculateTotalAmount();
        return cartDto;
    }

    private CartItemDto convertToDto(CartItem cartItem) {
        return CartItemDto.builder()
                .id(cartItem.getId())
                .productId(cartItem.getProduct().getId())
                .productName(cartItem.getProduct().getName())
                .price(cartItem.getPrice())
                .quantity(cartItem.getQuantity())
                .category(cartItem.getProduct().getCategory())
                .imageUrl(cartItem.getProduct().getImageUrl())
                .build();
    }
}
