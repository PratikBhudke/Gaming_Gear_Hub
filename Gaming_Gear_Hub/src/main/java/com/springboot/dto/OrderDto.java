package com.springboot.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class OrderDto {
    private Long id;
    private Long userId;
    private List<OrderItemDto> items;
    private LocalDateTime orderDate;
    private String status;
    private String shippingAddress;
    private Double totalAmount;

    public OrderDto() {
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

    public List<OrderItemDto> getItems() {
        return items;
    }

    public void setItems(List<OrderItemDto> items) {
        this.items = items != null ? items : new ArrayList<>();
        calculateTotalAmount();
    }

    public LocalDateTime getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(LocalDateTime orderDate) {
        this.orderDate = orderDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getShippingAddress() {
        return shippingAddress;
    }

    public void setShippingAddress(String shippingAddress) {
        this.shippingAddress = shippingAddress;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount != null ? totalAmount : 0.0;
    }

    private void calculateTotalAmount() {
        if (items != null && !items.isEmpty()) {
            this.totalAmount = items.stream()
                    .mapToDouble(OrderItemDto::getSubtotal)
                    .sum();
        } else {
            this.totalAmount = 0.0;
        }
    }

    public static OrderDtoBuilder builder() {
        return new OrderDtoBuilder();
    }

    public static class OrderDtoBuilder {
        private final OrderDto orderDto;

        private OrderDtoBuilder() {
            orderDto = new OrderDto();
        }

        public OrderDtoBuilder id(Long id) {
            orderDto.setId(id);
            return this;
        }

        public OrderDtoBuilder userId(Long userId) {
            orderDto.setUserId(userId);
            return this;
        }

        public OrderDtoBuilder items(List<OrderItemDto> items) {
            orderDto.setItems(items);
            return this;
        }

        public OrderDtoBuilder orderDate(LocalDateTime orderDate) {
            orderDto.setOrderDate(orderDate);
            return this;
        }

        public OrderDtoBuilder status(String status) {
            orderDto.setStatus(status);
            return this;
        }

        public OrderDtoBuilder shippingAddress(String shippingAddress) {
            orderDto.setShippingAddress(shippingAddress);
            return this;
        }

        public OrderDtoBuilder totalAmount(Double totalAmount) {
            orderDto.setTotalAmount(totalAmount);
            return this;
        }

        public OrderDto build() {
            orderDto.calculateTotalAmount();
            return orderDto;
        }
    }
}