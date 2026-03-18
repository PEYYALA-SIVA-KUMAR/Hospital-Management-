package com.hms.service;

import com.hms.dto.PaymentRequest;
import com.hms.model.Appointment;
import com.hms.model.Payment;
import com.hms.repository.PaymentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PaymentService {
  private final PaymentRepository paymentRepository;
  private final AppointmentService appointmentService;

  public PaymentService(PaymentRepository paymentRepository, AppointmentService appointmentService) {
    this.paymentRepository = paymentRepository;
    this.appointmentService = appointmentService;
  }

  @Transactional
  public Payment pay(PaymentRequest request) {
    Appointment appointment = appointmentService.getById(request.getAppointmentId());
    appointment.setStatus("AWAITING_ADMIN");
    Payment payment = new Payment(appointment, request.getAmount(), request.getMethod(), "SUCCESS");
    return paymentRepository.save(payment);
  }

  public void deleteByAppointment(Long appointmentId) {
    paymentRepository.deleteByAppointmentId(appointmentId);
  }

  public List<Payment> getAll() {
    return paymentRepository.findAll();
  }
}
