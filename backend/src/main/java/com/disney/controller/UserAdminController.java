package com.disney.controller;

import com.disney.dto.MessageResponse;
import com.disney.model.User;
import com.disney.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:4200")
public class UserAdminController {
    
    @Autowired
    private UserRepository userRepository;
    
    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }
    
    @PutMapping("/users/{id}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateUserRole(@PathVariable Long id, @RequestBody Map<String, String> request) {
        try {
            User user = userRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            String roleStr = request.get("role");
            User.Role role = User.Role.valueOf(roleStr);
            user.setRole(role);
            userRepository.save(user);
            
            return ResponseEntity.ok(new MessageResponse("User role updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Failed to update role: " + e.getMessage()));
        }
    }
    
    @PutMapping("/users/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateUserStatus(@PathVariable Long id, @RequestBody Map<String, Boolean> request) {
        try {
            User user = userRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            Boolean enabled = request.get("enabled");
            user.setEnabled(enabled);
            userRepository.save(user);
            
            return ResponseEntity.ok(new MessageResponse("User status updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Failed to update status: " + e.getMessage()));
        }
    }
}

