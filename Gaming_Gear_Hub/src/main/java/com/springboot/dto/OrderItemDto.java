package com.springboot.dto;

public class OrderItemDto {
    private Long id;
    private Long orderId;
    private Long productId;
    private String productName;
    private Double price;
    private Integer quantity;
    private Double subtotal;

    public OrderItemDto() {
        this.price = 0.0;
        this.quantity = 0;
        this.subtotal = 0.0;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price != null ? price : 0.0;
        calculateSubtotal();
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity != null ? quantity : 0;
        calculateSubtotal();
    }

    public Double getSubtotal() {
        return subtotal;
    }

    private void calculateSubtotal() {
        if (price != null && quantity != null) {
            this.subtotal = price * quantity;
        } else {
            this.subtotal = 0.0;
        }
    }

    public static OrderItemDtoBuilder builder() {
        return new OrderItemDtoBuilder();
    }

    public static class OrderItemDtoBuilder {
        private final OrderItemDto orderItemDto;

        private OrderItemDtoBuilder() {
            orderItemDto = new OrderItemDto();
        }

        public OrderItemDtoBuilder id(Long id) {
            orderItemDto.setId(id);
            return this;
        }

        public OrderItemDtoBuilder orderId(Long orderId) {
            orderItemDto.setOrderId(orderId);
            return this;
        }

        public OrderItemDtoBuilder productId(Long productId) {
            orderItemDto.setProductId(productId);
            return this;
        }

        public OrderItemDtoBuilder productName(String productName) {
            orderItemDto.setProductName(productName);
            return this;
        }

        public OrderItemDtoBuilder price(Double price) {
            orderItemDto.setPrice(price);
            return this;
        }

        public OrderItemDtoBuilder quantity(Integer quantity) {
            orderItemDto.setQuantity(quantity);
            return this;
        }

        public OrderItemDtoBuilder subtotal(Double subtotal) {
            orderItemDto.subtotal = subtotal;
            return this;
        }

        public OrderItemDto build() {
            orderItemDto.calculateSubtotal();
            return orderItemDto;
        }
    }
}
