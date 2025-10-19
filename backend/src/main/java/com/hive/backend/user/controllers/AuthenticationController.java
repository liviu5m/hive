package com.hive.backend.user.controllers;

import com.hive.backend.user.dtos.LoginUserDto;
import com.hive.backend.user.dtos.RegisterUserDto;
import com.hive.backend.user.dtos.ResendDto;
import com.hive.backend.user.dtos.VerifyDto;
import com.hive.backend.user.models.User;
import com.hive.backend.user.responses.LoginResponse;
import com.hive.backend.user.services.AuthenticationService;
import com.hive.backend.user.services.JwtService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/auth")
@RestController
public class AuthenticationController {
    private final JwtService jwtService;
    private final AuthenticationService authenticationService;

    public AuthenticationController(JwtService jwtService, AuthenticationService authenticationService) {
        this.jwtService = jwtService;
        this.authenticationService = authenticationService;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> register(
            @Valid @RequestBody RegisterUserDto registerUserDto) {
        User registeredUser = authenticationService.signup(registerUserDto);
        return ResponseEntity.ok(registeredUser);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> authenticate(@RequestBody LoginUserDto loginUserDto) {
        User authenticatedUser = authenticationService.authenticate(loginUserDto);
        if(!authenticatedUser.getEnabled()) throw new RuntimeException("Account not enabled |" + authenticatedUser.getId());
        String jwtToken = jwtService.generateToken(authenticatedUser);

        LoginResponse loginResponse = new LoginResponse(jwtToken, jwtService.getExpirationTime());

        return ResponseEntity.ok(loginResponse);
    }

    @PutMapping("/verify")
    public ResponseEntity<?> verify(@RequestBody VerifyDto verifyDto) {
        return ResponseEntity.ok(authenticationService.verifyAccount(verifyDto));
    }

    @PutMapping("/resend")
    public ResponseEntity<?> resend(@RequestBody ResendDto resendDto) {
        authenticationService.resendVerificationCode(resendDto);
        return ResponseEntity.ok("Code resent successful");
    }
}