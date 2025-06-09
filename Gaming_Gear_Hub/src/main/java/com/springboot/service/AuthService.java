package com.springboot.service;

import com.springboot.dto.UserDto;

public interface AuthService {
    UserDto registerUser(UserDto userDto);
    UserDto loginUser(UserDto userDto);
    UserDto getCurrentUser(String email);
    void resetPassword(String email, String newPassword);
}
