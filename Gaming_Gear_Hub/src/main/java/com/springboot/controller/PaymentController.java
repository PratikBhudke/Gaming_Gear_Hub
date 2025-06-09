package com.springboot.controller;

import com.razorpay.RazorpayException;
import com.springboot.dto.OrderRequest;
import com.springboot.dto.PaymentResponse;
import com.springboot.entity.ErrorResponse;
import com.springboot.entity.Order;
import com.springboot.service.OrderService;
import com.springboot.service.RazorpayService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "http://localhost:3000")
public class PaymentController {

    private static final Logger logger = LoggerFactory.getLogger(PaymentController.class);

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    private final RazorpayService razorpayService;
    private final OrderService orderService;

    public PaymentController(RazorpayService razorpayService, OrderService orderService) {
        this.razorpayService = razorpayService;
        this.orderService = orderService;
    }

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody OrderRequest orderRequest) {
        try {
            // Validate request
            if (orderRequest == null) {
                logger.error("Order request is null");
                return ResponseEntity.badRequest()
                    .body(new ErrorResponse("Order request cannot be null"));
            }

            // Validate required fields
            if (orderRequest.getAmount() == null || orderRequest.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
                String errorMsg = "Amount must be greater than 0";
                logger.error("{}: {}", errorMsg, orderRequest.getAmount());
                return ResponseEntity.badRequest()
                    .body(new ErrorResponse(errorMsg));
            }

            if (orderRequest.getCustomerName() == null || orderRequest.getCustomerName().trim().isEmpty()) {
                String errorMsg = "Customer name is required";
                logger.error(errorMsg);
                return ResponseEntity.badRequest()
                    .body(new ErrorResponse(errorMsg));
            }

            if (orderRequest.getEmail() == null || orderRequest.getEmail().trim().isEmpty()) {
                String errorMsg = "Email is required";
                logger.error(errorMsg);
                return ResponseEntity.badRequest()
                    .body(new ErrorResponse(errorMsg));
            }

            logger.debug("Creating order with request: {}", orderRequest.toString());
            
            try {
                com.razorpay.Order razorpayOrder = razorpayService.createOrder(orderRequest);
                logger.debug("Razorpay order created: {}", razorpayOrder.toString());
                
                // Create order in our database
                Order localOrder = orderService.createOrder(orderRequest);
                if (localOrder == null) {
                    String errorMsg = "Failed to create order in database";
                    logger.error(errorMsg);
                    return ResponseEntity.internalServerError()
                        .body(new ErrorResponse(errorMsg));
                }

                localOrder.setRazorpayOrderId(razorpayOrder.get("id"));
                orderService.updateOrder(localOrder);
                
                String orderId = razorpayOrder.get("id");
                logger.info("Local order created and updated with Razorpay ID - {}", orderId);

                // Create response with all required fields
                Map<String, Object> response = new HashMap<>();
                response.put("orderId", orderId);
                response.put("currency", razorpayOrder.get("currency"));
                response.put("amount", razorpayOrder.get("amount"));
                response.put("keyId", razorpayKeyId);
                
                logger.debug("Returning order response: {}", response);
                return ResponseEntity.ok(response);
                
            } catch (RazorpayException e) {
                String errorMsg = "Failed to create Razorpay order: " + e.getMessage();
                logger.error(errorMsg, e);
                return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(new ErrorResponse(errorMsg));
            }
            
        } catch (Exception e) {
            String errorMsg = "Unexpected error while creating order: " + e.getMessage();
            logger.error(errorMsg, e);
            return ResponseEntity.internalServerError()
                .body(new ErrorResponse(errorMsg));
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(
            @RequestParam String orderId,
            @RequestParam String paymentId,
            @RequestParam String signature) {
        try {
            logger.debug("Verifying payment - orderId: {}, paymentId: {}", orderId, paymentId);
            
            boolean isValid = razorpayService.validateSignature(orderId, paymentId, signature);
            
            if (isValid) {
                // Update order status in database
                Order order = orderService.findByRazorpayOrderId(orderId);
                if (order != null) {
                    order.setRazorpayPaymentId(paymentId);
                    order.setRazorpaySignature(signature);
                    order.setPaymentStatus("COMPLETED");
                    order.setStatus("PROCESSING");
                    orderService.updateOrder(order);
                    logger.info("Payment verified and order updated for orderId - {}", orderId);
                } else {
                    logger.error("Order not found for Razorpay orderId: {}", orderId);
                }
                
                return ResponseEntity.ok(new PaymentResponse("SUCCESS", "Payment verified successfully"));
            } else {
                String errorMsg = "Payment signature verification failed";
                logger.error("{} - orderId: {}", errorMsg, orderId);
                return ResponseEntity.badRequest()
                    .body(new PaymentResponse("FAILED", errorMsg));
            }
            
        } catch (RazorpayException e) {
            String errorMsg = "Error verifying payment: " + e.getMessage();
            logger.error("{} - orderId: {}", errorMsg, orderId, e);
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(new PaymentResponse("ERROR", errorMsg));
        } catch (Exception e) {
            String errorMsg = "Unexpected error during payment verification: " + e.getMessage();
            logger.error("{} - orderId: {}", errorMsg, orderId, e);
            return ResponseEntity.internalServerError()
                .body(new PaymentResponse("ERROR", errorMsg));
        }
    }
}
