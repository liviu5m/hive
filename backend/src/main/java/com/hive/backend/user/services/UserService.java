package com.hive.backend.user.services;

import com.hive.backend.user.dtos.UserDto;
import com.hive.backend.user.models.User;
import com.hive.backend.user.repositories.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public User updateUser(Long id, UserDto userDto) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        System.out.println(userDto);
        user.setName(userDto.getName());
        user.setBio(userDto.getBio());
        user.setUsername(userDto.getUsername());
        user.setLocation(userDto.getLocation());
        user.setProfilePicture(userDto.getProfilePicture());
        user.setCoverPicture(userDto.getCoverPicture());
        System.out.println(user);
        return userRepository.save(user);
    }

    public Page<User> getAllUsers(String search, Pageable pageable) {
        if(search.isEmpty() || search.trim().isEmpty()) return userRepository.findAll(pageable);
        return userRepository.findByUsernameContainingIgnoreCaseOrNameContainingIgnoreCase(search,search, pageable);
    }

    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsernameContainingIgnoreCase(username);
    }
}
