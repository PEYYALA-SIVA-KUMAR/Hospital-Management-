package com.hms.controller;

import com.hms.dto.AppointmentRequest;
import com.hms.dto.PaymentRequest;
import com.hms.model.Appointment;
import com.hms.model.Payment;
import com.hms.model.User;
import com.hms.repository.UserRepository;
import com.hms.service.AppointmentService;
import com.hms.service.PaymentService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/patient")
public class PatientController {
  private final AppointmentService appointmentService;
  private final PaymentService paymentService;
  private final UserRepository userRepository;

  public PatientController(AppointmentService appointmentService, PaymentService paymentService, UserRepository userRepository) {
    this.appointmentService = appointmentService;
    this.paymentService = paymentService;
    this.userRepository = userRepository;
  }

  @GetMapping("/appointments")
  public List<Appointment> myAppointments(HttpSession session) {
    Long userId = requirePatient(session);
    return appointmentService.getForUser(userId);
  }

  @PostMapping("/appointments")
  public Appointment book(@Valid @RequestBody AppointmentRequest request, HttpSession session) {
    Long userId = requirePatient(session);
    User user = userRepository.findById(userId)
      .orElseThrow(() -> new IllegalArgumentException("User not found"));
    return appointmentService.create(user, request);
  }

  @PostMapping("/payments")
  public Payment pay(@Valid @RequestBody PaymentRequest request, HttpSession session) {
    Long userId = requirePatient(session);
    Appointment appointment = appointmentService.getById(request.getAppointmentId());
    if (!appointment.getUser().getId().equals(userId)) {
      throw new IllegalArgumentException("Unauthorized appointment access");
    }
    return paymentService.pay(request);
  }

  @PostMapping("/logout")
  public Map<String, String> logout(HttpSession session) {
    session.invalidate();
    return Map.of("message", "Logged out");
  }

  private Long requirePatient(HttpSession session) {
    Object role = session.getAttribute("ROLE");
    if (role == null || !role.toString().equals("PATIENT")) {
      throw new IllegalStateException("Patient login required");
    }
    Object userId = session.getAttribute("USER_ID");
    if (userId == null) {
      throw new IllegalStateException("Patient login required");
    }
    return (Long) userId;
  }
}
