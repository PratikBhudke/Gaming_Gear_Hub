package com.springboot.service.impl;

import com.springboot.dto.OrderDto;
import com.springboot.dto.OrderItemDto;
import com.springboot.dto.OrderRequest;
import com.springboot.entity.Cart;
import com.springboot.entity.Order;
import com.springboot.entity.OrderItem;
import com.springboot.entity.User;
import com.springboot.exception.ResourceNotFoundException;
import com.springboot.repository.OrderRepository;
import com.springboot.repository.UserRepository;
import com.springboot.service.CartService;
import com.springboot.service.OrderService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements OrderService {

    private static final Logger logger = LoggerFactory.getLogger(OrderServiceImpl.class);

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final CartService cartService;

    @Autowired
    public OrderServiceImpl(OrderRepository orderRepository, UserRepository userRepository, 
                          CartService cartService) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.cartService = cartService;
    }

    @Override
    @Transactional
    public OrderDto createOrder(Long userId, OrderDto orderDto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Cart cart = cartService.getCartEntity(userId);
        if (cart.getCartItems().isEmpty()) {
            throw new IllegalStateException("Cannot create order with empty cart");
        }

        Order order = new Order();
        order.setUser(user);
        order.setOrderDate(LocalDateTime.now());
        order.setStatus("PENDING");
        order.setShippingAddress(orderDto.getShippingAddress());

        List<OrderItem> orderItems = cart.getCartItems().stream()
                .map(cartItem -> {
                    OrderItem orderItem = new OrderItem();
                    orderItem.setOrder(order);
                    orderItem.setProduct(cartItem.getProduct());
                    orderItem.setQuantity(cartItem.getQuantity());
                    orderItem.setPrice(cartItem.getProduct().getPrice());
                    return orderItem;
                })
                .collect(Collectors.toList());

        order.setOrderItems(orderItems);
        order.calculateTotalAmount();

        Order savedOrder = orderRepository.save(order);
        cartService.clearCart(userId);

        return convertToDto(savedOrder);
    }

    @Override
    @Transactional
    public Order createOrder(OrderRequest orderRequest) {
        logger.debug("Creating order from request: {}", orderRequest);
        
        if (orderRequest.getCartId() == null) {
            logger.error("Cart ID is null in order request");
            throw new IllegalArgumentException("Cart ID is required");
        }

        User user = userRepository.findByEmail(orderRequest.getEmail())
                .orElseThrow(() -> {
                    logger.error("User not found with email: {}", orderRequest.getEmail());
                    return new ResourceNotFoundException("User not found with email: " + orderRequest.getEmail());
                });

        Cart cart = cartService.getCartEntity(user.getId());
        if (cart == null || !cart.getId().equals(orderRequest.getCartId())) {
            logger.error("Cart not found or does not match. User ID: {}, Cart ID: {}", 
                user.getId(), orderRequest.getCartId());
            throw new ResourceNotFoundException("Cart not found");
        }

        Order order = new Order();
        order.setUser(user);
        order.setOrderDate(LocalDateTime.now());
        order.setStatus("PENDING");
        order.setShippingAddress(orderRequest.getAddress());

        List<OrderItem> orderItems = cart.getCartItems().stream()
                .map(cartItem -> {
                    OrderItem orderItem = new OrderItem();
                    orderItem.setOrder(order);
                    orderItem.setProduct(cartItem.getProduct());
                    orderItem.setQuantity(cartItem.getQuantity());
                    orderItem.setPrice(cartItem.getProduct().getPrice());
                    return orderItem;
                })
                .collect(Collectors.toList());

        order.setOrderItems(orderItems);
        order.calculateTotalAmount();

        Order savedOrder = orderRepository.save(order);
        cartService.clearCart(user.getId());

        return savedOrder;
    }

    @Override
    public List<OrderDto> getUserOrders(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        return orderRepository.findByUserOrderByOrderDateDesc(user).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public Page<OrderDto> getUserOrders(String username, Pageable pageable) {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + username));
        
        return orderRepository.findByUserOrderByOrderDateDesc(user, pageable)
                .map(this::convertToDto);
    }

    @Override
    public OrderDto getOrder(Long orderId) {
        return convertToDto(orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found")));
    }

    @Override
    @Transactional
    public OrderDto updateOrderStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        order.setStatus(status);
        return convertToDto(orderRepository.save(order));
    }

    @Override
    @Transactional
    public void cancelOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        order.setStatus("CANCELLED");
        orderRepository.save(order);
    }

    @Override
    public Order findByRazorpayOrderId(String razorpayOrderId) {
        return orderRepository.findByRazorpayOrderId(razorpayOrderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with Razorpay ID: " + razorpayOrderId));
    }

    @Override
    public Order updateOrder(Order order) {
        return orderRepository.save(order);
    }

    private OrderDto convertToDto(Order order) {
        OrderDto dto = new OrderDto();
        dto.setId(order.getId());
        dto.setUserId(order.getUser().getId());
        dto.setOrderDate(order.getOrderDate());
        dto.setStatus(order.getStatus());
        dto.setShippingAddress(order.getShippingAddress());
        dto.setTotalAmount(order.getTotalAmount());
        
        List<OrderItemDto> itemDtos = order.getOrderItems().stream()
                .map(item -> {
                    OrderItemDto itemDto = new OrderItemDto();
                    itemDto.setId(item.getId());
                    itemDto.setProductId(item.getProduct().getId());
                    itemDto.setProductName(item.getProduct().getName());
                    itemDto.setQuantity(item.getQuantity());
                    itemDto.setPrice(item.getPrice());
                    return itemDto;
                })
                .collect(Collectors.toList());
        
        dto.setItems(itemDtos);
        return dto;
    }
}
