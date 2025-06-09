package com.springboot.service;

import com.springboot.dto.OrderDto;
import com.springboot.dto.OrderRequest;
import com.springboot.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface OrderService {
    OrderDto createOrder(Long userId, OrderDto orderDto);
    Order createOrder(OrderRequest orderRequest);
    List<OrderDto> getUserOrders(Long userId);
    Page<OrderDto> getUserOrders(String username, Pageable pageable);
    OrderDto getOrder(Long orderId);
    OrderDto updateOrderStatus(Long orderId, String status);
    void cancelOrder(Long orderId);
    Order findByRazorpayOrderId(String razorpayOrderId);
    Order updateOrder(Order order);
}