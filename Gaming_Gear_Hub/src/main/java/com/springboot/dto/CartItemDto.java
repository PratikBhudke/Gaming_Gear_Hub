package com.springboot.dto;

public class CartItemDto {
    private Long id;
    private Long productId;
    private String productName;
    private Double price;
    private Integer quantity;
    private Double subtotal;
    private String category;
    private String imageUrl;

    private CartItemDto() {
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

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    private void calculateSubtotal() {
        if (price != null && quantity != null && quantity > 0) {
            this.subtotal = price * quantity;
        } else {
            this.subtotal = 0.0;
        }
    }

    public static CartItemDtoBuilder builder() {
        return new CartItemDtoBuilder();
    }

    public static class CartItemDtoBuilder {
        private final CartItemDto cartItemDto;

        private CartItemDtoBuilder() {
            cartItemDto = new CartItemDto();
        }

        public CartItemDtoBuilder id(Long id) {
            cartItemDto.setId(id);
            return this;
        }

        public CartItemDtoBuilder productId(Long productId) {
            cartItemDto.setProductId(productId);
            return this;
        }

        public CartItemDtoBuilder productName(String productName) {
            cartItemDto.setProductName(productName);
            return this;
        }

        public CartItemDtoBuilder price(Double price) {
            cartItemDto.setPrice(price);
            return this;
        }

        public CartItemDtoBuilder quantity(Integer quantity) {
            cartItemDto.setQuantity(quantity);
            return this;
        }

        public CartItemDtoBuilder category(String category) {
            cartItemDto.setCategory(category);
            return this;
        }

        public CartItemDtoBuilder imageUrl(String imageUrl) {
            cartItemDto.setImageUrl(imageUrl);
            return this;
        }

        public CartItemDto build() {
            cartItemDto.calculateSubtotal();
            return cartItemDto;
        }
    }
}
