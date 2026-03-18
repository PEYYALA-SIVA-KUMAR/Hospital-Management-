package com.hms.repository;

import com.hms.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
  void deleteByAppointmentId(Long appointmentId);
}
