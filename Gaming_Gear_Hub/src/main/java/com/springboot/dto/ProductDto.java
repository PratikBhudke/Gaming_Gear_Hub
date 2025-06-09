package com.springboot.dto;

public class ProductDto {
    private Long id;
    private String name;
    private String description;
    private Double price; 
    private Integer stock;
    private String category;
    private String brand;
    private String imageUrl;
    private Boolean isWireless;
    private String compatibility;
    private Double rating;

    public ProductDto() {
        this.price = 0.0;
        this.rating = 0.0;
    }

    public ProductDto(Long id, String name, String description, Double price, 
                     Integer stock, String category, String brand, String imageUrl, 
                     Boolean isWireless, String compatibility, Double rating) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price != null ? price : 0.0;
        this.stock = stock;
        this.category = category;
        this.brand = brand;
        this.imageUrl = imageUrl;
        this.isWireless = isWireless;
        this.compatibility = compatibility;
        this.rating = rating != null ? rating : 0.0;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Boolean isWireless() {
        return isWireless;
    }

    public void setWireless(Boolean wireless) {
        isWireless = wireless;
    }

    public String getCompatibility() {
        return compatibility;
    }

    public void setCompatibility(String compatibility) {
        this.compatibility = compatibility;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }
}
