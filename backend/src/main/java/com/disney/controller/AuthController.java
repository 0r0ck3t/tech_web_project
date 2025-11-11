package com.disney.controller;

import com.disney.dto.*;
import com.disney.model.User;
import com.disney.repository.UserRepository;
import com.disney.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMethod;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
    @Autowired
    private UserRepository userRepository;
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            JwtResponse response = authService.login(loginRequest);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Invalid credentials"));
        }
    }
    
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) {
        try {
            MessageResponse response = authService.register(registerRequest);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest resetPasswordRequest) {
        try {
            MessageResponse response = authService.resetPassword(resetPasswordRequest);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    @PutMapping("/update-account")
    public ResponseEntity<?> updateAccount(@RequestBody UpdateAccountRequest updateRequest) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || auth.getName() == null) {
                return ResponseEntity.status(401).body(new MessageResponse("Not authenticated"));
            }
            String currentUsername = auth.getName();
            
            User user = userRepository.findByUsername(currentUsername)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            boolean usernameChanged = false;
            
            // Check if new username already exists (if changed)
            if (!updateRequest.getUsername().equals(currentUsername)) {
                if (userRepository.existsByUsername(updateRequest.getUsername())) {
                    return ResponseEntity.badRequest().body(new MessageResponse("Username already exists"));
                }
                user.setUsername(updateRequest.getUsername());
                usernameChanged = true;
            }
            
            // Check if new email already exists (if changed)
            if (!updateRequest.getEmail().equals(user.getEmail())) {
                if (userRepository.existsByEmail(updateRequest.getEmail())) {
                    return ResponseEntity.badRequest().body(new MessageResponse("Email already exists"));
                }
                user.setEmail(updateRequest.getEmail());
            }
            
            userRepository.save(user);
            
            // If username changed, generate new JWT token
            String newToken = null;
            if (usernameChanged) {
                // Create new authentication with updated username
                UsernamePasswordAuthenticationToken newAuth = 
                    new UsernamePasswordAuthenticationToken(user.getUsername(), null);
                SecurityContextHolder.getContext().setAuthentication(newAuth);
                newToken = authService.generateJwtTokenForUser(user.getUsername());
            }
            
            // Return updated user info with new token if username changed
            JwtResponse response = new JwtResponse(
                newToken, // New token if username changed, null otherwise
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole().name()
            );
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
}

