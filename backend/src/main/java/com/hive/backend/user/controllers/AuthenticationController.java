package com.hive.backend.user.controllers;

import com.hive.backend.user.dtos.LoginUserDto;
import com.hive.backend.user.dtos.RegisterUserDto;
import com.hive.backend.user.dtos.ResendDto;
import com.hive.backend.user.dtos.VerifyDto;
import com.hive.backend.user.models.User;
import com.hive.backend.user.responses.LoginResponse;
import com.hive.backend.user.services.AuthenticationService;
import com.hive.backend.user.services.JwtService;
import com.hive.backend.user.services.UserService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RequestMapping("/auth")
@RestController
public class AuthenticationController {
    private final JwtService jwtService;
    private final AuthenticationService authenticationService;
    private final UserService userService;

    public AuthenticationController(JwtService jwtService, AuthenticationService authenticationService, UserService userService) {
        this.jwtService = jwtService;
        this.authenticationService = authenticationService;
        this.userService = userService;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> register(
            @Valid @RequestBody RegisterUserDto registerUserDto) {
        try {
            User registeredUser = authenticationService.signup(registerUserDto);
            return ResponseEntity.ok(registeredUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticate(@RequestBody LoginUserDto loginUserDto, HttpServletResponse response) {
        User authenticatedUser = authenticationService.authenticate(loginUserDto);
        if(!authenticatedUser.getEnabled()) throw new RuntimeException("Account not enabled |" + authenticatedUser.getId());
        if(!authenticatedUser.getProvider().equals("credentials")) throw new RuntimeException("This method of authentication supports only credentials.");
        String jwtToken = jwtService.generateToken(authenticatedUser);

        ResponseCookie jwtCookie = ResponseCookie.from("jwt", jwtToken)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge((int) (jwtService.getExpirationTime() / 1000))
                .sameSite("None")
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, jwtCookie.toString());
        return ResponseEntity.ok("Successfully logged in");
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        ResponseCookie jwtCookie = ResponseCookie.from("jwt", "")
                .path("/")
                .maxAge(0)
                .httpOnly(true)
                .secure(true)
                .sameSite("None")
                .build();

        response.addHeader(org.springframework.http.HttpHeaders.SET_COOKIE, jwtCookie.toString());

        return ResponseEntity.ok("Logged out successfully");
    }

    @GetMapping("/jwt")
    public ResponseEntity<?> verifyAuth(@CookieValue(value = "jwt", required = false) String token) {
        if (token != null && jwtService.isTokenValid(token)) {
            String id = jwtService.extractUserId(token);
            Optional<User> user = userService.findById(Long.parseLong(id));
            if(user.isPresent()) {
                return ResponseEntity.ok(user.get());
            }
            return ResponseEntity.ok(null);
        } else {
            return ResponseEntity.ok(null);
        }
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