package com.springboot.service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.springboot.dto.OrderRequest;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;

@Service
public class RazorpayService {

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    private RazorpayClient razorpayClient;

    public Order createOrder(OrderRequest orderRequest) throws RazorpayException {
        if (razorpayClient == null) {
            razorpayClient = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
        }

        // Validate amount
        BigDecimal amount = orderRequest.getAmount();
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Amount must be greater than 0");
        }

        JSONObject orderDetails = new JSONObject();
        // Convert amount to paise (Indian currency)
        orderDetails.put("amount", amount.multiply(new BigDecimal(100)).intValue());
        orderDetails.put("currency", orderRequest.getCurrency() != null ? orderRequest.getCurrency() : "INR");
        orderDetails.put("receipt", "order_" + System.currentTimeMillis());
        
        JSONObject notes = new JSONObject();
        notes.put("customerName", orderRequest.getCustomerName());
        notes.put("email", orderRequest.getEmail());
        notes.put("phoneNumber", orderRequest.getPhoneNumber());
        notes.put("shippingAddress", orderRequest.getAddress());
        orderDetails.put("notes", notes);

        return razorpayClient.orders.create(orderDetails);
    }

    public boolean validateSignature(String orderId, String paymentId, String signature) throws RazorpayException {
        if (razorpayClient == null) {
            razorpayClient = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
        }

        String expectedSignature = com.razorpay.Utils.getHash(orderId + "|" + paymentId, razorpayKeySecret);
        return expectedSignature.equals(signature);
    }
}
