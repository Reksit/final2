package com.example.manager.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class ResendCodeRequest {
    
    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid and contain @ symbol")
    @Pattern(regexp = ".*@.*", message = "Email must contain @ symbol")
    private String email;

    // Constructors
    public ResendCodeRequest() {}

    public ResendCodeRequest(String email) {
        this.email = email;
    }

    // Getters and Setters
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}