package com.hms.service;

import com.hms.dto.RegisterRequest;
import com.hms.model.User;
import com.hms.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;

  @Value("${app.admin.email}")
  private String adminEmail;

  @Value("${app.admin.password}")
  private String adminPassword;

  public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
  }

  public User register(RegisterRequest request) {
    if (userRepository.existsByEmail(request.getEmail())) {
      throw new IllegalArgumentException("Email already registered");
    }
    String hash = passwordEncoder.encode(request.getPassword());
    User user = new User(
      request.getFullName(),
      request.getEmail(),
      hash,
      request.getPhone(),
      request.getAge(),
      request.getGender()
    );
    return userRepository.save(user);
  }

  public User authenticatePatient(String email, String password) {
    User user = userRepository.findByEmail(email)
      .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));
    if (!passwordEncoder.matches(password, user.getPasswordHash())) {
      throw new IllegalArgumentException("Invalid credentials");
    }
    return user;
  }

  public boolean authenticateAdmin(String email, String password) {
    return adminEmail.equalsIgnoreCase(email) && adminPassword.equals(password);
  }
}
