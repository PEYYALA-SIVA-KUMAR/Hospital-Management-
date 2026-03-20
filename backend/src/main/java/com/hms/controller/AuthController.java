package com.hms.controller;

import com.hms.dto.LoginRequest;
import com.hms.dto.RegisterRequest;
import com.hms.model.User;
import com.hms.repository.UserRepository;
import com.hms.service.AuthService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
  private final AuthService authService;
  private final UserRepository userRepository;

  public AuthController(AuthService authService, UserRepository userRepository) {
    this.authService = authService;
    this.userRepository = userRepository;
  }

  @PostMapping("/register")
  public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
    User user = authService.register(request);
    Map<String, Object> response = new HashMap<>();
    response.put("message", "Registration successful");
    response.put("userId", user.getId());
    return ResponseEntity.ok(response);
  }

  @PostMapping("/login")
  public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request, HttpSession session) {
    String role = request.getRole().trim().toLowerCase();
    if (role.equals("admin")) {
      boolean ok = authService.authenticateAdmin(request.getEmail(), request.getPassword());
      if (!ok) {
        throw new IllegalArgumentException("Invalid admin credentials");
      }
      session.setAttribute("ROLE", "ADMIN");
      session.setAttribute("USER_ID", null);
      return ResponseEntity.ok(Map.of("role", "ADMIN"));
    }

    User user = authService.authenticatePatient(request.getEmail(), request.getPassword());
    session.setAttribute("ROLE", "PATIENT");
    session.setAttribute("USER_ID", user.getId());
    return ResponseEntity.ok(Map.of("role", "PATIENT", "userId", user.getId()));
  }

  @PostMapping("/logout")
  public ResponseEntity<?> logout(HttpSession session) {
    session.invalidate();
    return ResponseEntity.ok(Map.of("message", "Logged out"));
  }

  @GetMapping("/me")
  public ResponseEntity<?> me(HttpSession session) {
    Object role = session.getAttribute("ROLE");
    Object userId = session.getAttribute("USER_ID");
    if (role != null && role.toString().equals("PATIENT") && userId instanceof Long) {
      User user = userRepository.findById((Long) userId)
        .orElseThrow(() -> new IllegalArgumentException("User not found"));
      Map<String, Object> response = new HashMap<>();
      response.put("role", "PATIENT");
      response.put("userId", user.getId());
      response.put("fullName", user.getFullName());
      response.put("email", user.getEmail());
      response.put("phone", user.getPhone());
      response.put("age", user.getAge());
      response.put("gender", user.getGender());
      return ResponseEntity.ok(response);
    }
    Map<String, Object> response = new HashMap<>();
    response.put("role", role);
    response.put("userId", userId);
    return ResponseEntity.ok(response);
  }
}
