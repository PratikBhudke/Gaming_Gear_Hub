package com.springboot.service;

import com.springboot.dto.UserDto;
import com.springboot.entity.User;
import java.util.List;

public interface UserService {
    User save(User user);
    UserDto createUser(User user);
    UserDto getUserById(Long id);
    UserDto updateUser(Long id, User user);
    void deleteUser(Long id);
    List<UserDto> getAllUsers();
    User findByEmail(String email);
    boolean existsByEmail(String email);
    void updatePassword(User user, String newPassword);
}
