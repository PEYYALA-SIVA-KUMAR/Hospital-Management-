package com.hms.service;

import com.hms.dto.AppointmentRequest;
import com.hms.model.Appointment;
import com.hms.model.Doctor;
import com.hms.model.User;
import com.hms.repository.AppointmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AppointmentService {
  private final AppointmentRepository appointmentRepository;
  private final DoctorService doctorService;

  public AppointmentService(AppointmentRepository appointmentRepository, DoctorService doctorService) {
    this.appointmentRepository = appointmentRepository;
    this.doctorService = doctorService;
  }

  public Appointment create(User user, AppointmentRequest request) {
    Doctor doctor = doctorService.getById(request.getDoctorId());
    Appointment appointment = new Appointment(
      user,
      doctor,
      request.getProblemDescription(),
      request.getAppointmentDate(),
      "PENDING"
    );
    return appointmentRepository.save(appointment);
  }

  public List<Appointment> getForUser(Long userId) {
    return appointmentRepository.findByUserIdOrderByCreatedAtDesc(userId);
  }

  public List<Appointment> getAll() {
    return appointmentRepository.findAll();
  }

  public Appointment updateStatus(Long id, String status) {
    Appointment appointment = appointmentRepository.findById(id)
      .orElseThrow(() -> new IllegalArgumentException("Appointment not found"));
    appointment.setStatus(status);
    return appointmentRepository.save(appointment);
  }

  public void delete(Long id) {
    appointmentRepository.deleteById(id);
  }

  public Appointment getById(Long id) {
    return appointmentRepository.findById(id)
      .orElseThrow(() -> new IllegalArgumentException("Appointment not found"));
  }
}
