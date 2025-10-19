package com.hive.backend.user.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterUserDto {

    @NotBlank(message = "Email is required")
    private String name;
    @NotBlank(message = "Username is required")
    private String username;
    @NotBlank(message = "Email is required")
    @Email(message = "Please provide a valid email")
    private String email;
    @NotBlank(message = "Password is required")
    private String password;
    @NotBlank(message = "Password Confirmation is required")
    private String passwordConfirmation;
}
