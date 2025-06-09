package com.springboot.repository;

import com.springboot.entity.Order;
import com.springboot.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserId(Long userId);
    List<Order> findByStatus(String status);
    List<Order> findByOrderDateBetween(LocalDateTime start, LocalDateTime end);
    List<Order> findByUserOrderByOrderDateDesc(User user);
    Page<Order> findByUserOrderByOrderDateDesc(User user, Pageable pageable);
    Optional<Order> findByRazorpayOrderId(String razorpayOrderId);
}
