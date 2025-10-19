package com.hive.backend.user.services;

import com.hive.backend.user.dtos.LoginUserDto;
import com.hive.backend.user.dtos.RegisterUserDto;
import com.hive.backend.user.dtos.ResendDto;
import com.hive.backend.user.dtos.VerifyDto;
import com.hive.backend.user.models.User;
import com.hive.backend.user.repositories.UserRepository;
import com.hive.backend.utils.services.EmailService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
public class AuthenticationService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;

    public AuthenticationService(UserRepository userRepository, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager, EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.emailService = emailService;
    }

    public User signup(RegisterUserDto input) {
        if(!input.getPassword().equals(input.getPasswordConfirmation())) throw new RuntimeException("Passwords do not match");
        User user = new User(input.getName(), input.getUsername(), input.getEmail(), passwordEncoder.encode(input.getPassword()));
        user.setEnabled(false);
        user.setVerificationCode(generateSixDigitCode());
        user.setVerificationCodeExpiresAt(LocalDateTime.now().plusMinutes(5));
        emailService.sendVerificationEmailTemplate(user);
        return userRepository.save(user);
    }

    public User authenticate(LoginUserDto input) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        input.getEmail(),
                        input.getPassword()
                )
        );

        return userRepository.findByEmail(input.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));
    }

    public String verifyAccount(VerifyDto verifyDto) {
        User user = userRepository.findById(verifyDto.getUserId()).orElseThrow(() -> new RuntimeException("User not found"));
        if(user.getVerificationCodeExpiresAt().isBefore(LocalDateTime.now())) throw new RuntimeException("Code has expired");
        if(!user.getVerificationCode().equals(verifyDto.getCode())) throw new RuntimeException("Codes do not match.");
        user.setVerificationCodeExpiresAt(null);
        user.setVerificationCode(null);
        user.setEnabled(true);
        userRepository.save(user);
        return "Account has been verified successfully";
    }

    public void resendVerificationCode(ResendDto resendDto) {
        User user = userRepository.findById(resendDto.getUserId()).orElseThrow(() -> new RuntimeException("User not found"));
        user.setVerificationCode(generateSixDigitCode());
        user.setVerificationCodeExpiresAt(LocalDateTime.now().plusMinutes(5));
        userRepository.save(user);
        emailService.sendVerificationEmailTemplate(user);
    }

    public String generateSixDigitCode() {
        Random random = new Random();
        int code = random.nextInt(900000) + 100000;
        return String.valueOf(code);
    }
}