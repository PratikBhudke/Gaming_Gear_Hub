package com.springboot.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "carts")
public class Cart {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CartItem> cartItems = new ArrayList<>();

    private Double totalAmount;

    public Cart() {
        this.cartItems = new ArrayList<>();
        this.totalAmount = 0.0;
    }

    public Cart(Long id, User user, List<CartItem> cartItems, Double totalAmount) {
        this.id = id;
        this.user = user;
        this.cartItems = cartItems != null ? cartItems : new ArrayList<>();
        this.totalAmount = totalAmount != null ? totalAmount : 0.0;
    }

    public void addCartItem(CartItem cartItem) {
        if (cartItems == null) {
            cartItems = new ArrayList<>();
        }
        cartItems.add(cartItem);
        cartItem.setCart(this);
        calculateTotal();
    }

    public void removeCartItem(CartItem cartItem) {
        if (cartItems != null) {
            cartItems.remove(cartItem);
            cartItem.setCart(null);
            calculateTotal();
        }
    }

    public void clear() {
        if (cartItems != null) {
            cartItems.clear();
            calculateTotal();
        }
    }

    private void calculateTotal() {
        if (cartItems != null) {
            this.totalAmount = cartItems.stream()
                    .mapToDouble(item -> item.getPrice() * item.getQuantity())
                    .sum();
        } else {
            this.totalAmount = 0.0;
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public List<CartItem> getCartItems() {
        return cartItems;
    }

    public void setCartItems(List<CartItem> cartItems) {
        this.cartItems = cartItems != null ? cartItems : new ArrayList<>();
        calculateTotal();
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount != null ? totalAmount : 0.0;
    }
}
