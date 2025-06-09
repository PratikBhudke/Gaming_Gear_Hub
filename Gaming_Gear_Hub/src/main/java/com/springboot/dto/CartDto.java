package com.springboot.dto;

import java.util.ArrayList;
import java.util.List;

public class CartDto {
    private Long id;
    private Long userId;
    private List<CartItemDto> items;
    private Double totalAmount;

    private CartDto() {
        this.items = new ArrayList<>();
        this.totalAmount = 0.0;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public List<CartItemDto> getItems() {
        return items;
    }

    public void setItems(List<CartItemDto> items) {
        this.items = items != null ? items : new ArrayList<>();
        calculateTotalAmount();
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount != null ? totalAmount : 0.0;
    }

    public void calculateTotalAmount() {
        if (items != null && !items.isEmpty()) {
            this.totalAmount = items.stream()
                    .mapToDouble(CartItemDto::getSubtotal)
                    .sum();
        } else {
            this.totalAmount = 0.0;
        }
    }

    public static CartDtoBuilder builder() {
        return new CartDtoBuilder();
    }

    public static class CartDtoBuilder {
        private final CartDto cartDto;

        private CartDtoBuilder() {
            cartDto = new CartDto();
        }

        public CartDtoBuilder id(Long id) {
            cartDto.setId(id);
            return this;
        }

        public CartDtoBuilder userId(Long userId) {
            cartDto.setUserId(userId);
            return this;
        }

        public CartDtoBuilder items(List<CartItemDto> items) {
            cartDto.setItems(items);
            return this;
        }

        public CartDtoBuilder totalAmount(Double totalAmount) {
            cartDto.setTotalAmount(totalAmount);
            return this;
        }

        public CartDto build() {
            cartDto.calculateTotalAmount();
            return cartDto;
        }
    }
}
