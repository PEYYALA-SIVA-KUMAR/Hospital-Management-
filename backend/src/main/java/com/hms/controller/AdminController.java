package com.hms.controller;

import com.hms.dto.StatusRequest;
import com.hms.model.Appointment;
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
@RequestMapping("/api/admin")
public class AdminController {
  private final AppointmentService appointmentService;
  private final PaymentService paymentService;
  private final UserRepository userRepository;

  public AdminController(AppointmentService appointmentService, PaymentService paymentService, UserRepository userRepository) {
    this.appointmentService = appointmentService;
    this.paymentService = paymentService;
    this.userRepository = userRepository;
  }

  @GetMapping("/patients")
  public List<User> getPatients(HttpSession session) {
    requireAdmin(session);
    return userRepository.findAll();
  }

  @GetMapping("/appointments")
  public List<Appointment> getAppointments(HttpSession session) {
    requireAdmin(session);
    return appointmentService.getAll();
  }

  @PatchMapping("/appointments/{id}/status")
  public Appointment updateStatus(@PathVariable Long id, @Valid @RequestBody StatusRequest request, HttpSession session) {
    requireAdmin(session);
    String status = request.getStatus().toUpperCase();
    if (!status.equals("CONFIRMED") && !status.equals("REJECTED")) {
      throw new IllegalArgumentException("Status must be CONFIRMED or REJECTED");
    }
    return appointmentService.updateStatus(id, status);
  }

  @DeleteMapping("/appointments/{id}")
  public Map<String, String> deleteAppointment(@PathVariable Long id, HttpSession session) {
    requireAdmin(session);
    paymentService.deleteByAppointment(id);
    appointmentService.delete(id);
    return Map.of("message", "Appointment deleted");
  }

  private void requireAdmin(HttpSession session) {
    Object role = session.getAttribute("ROLE");
    if (role == null || !role.toString().equals("ADMIN")) {
      throw new IllegalStateException("Admin login required");
    }
  }
}
