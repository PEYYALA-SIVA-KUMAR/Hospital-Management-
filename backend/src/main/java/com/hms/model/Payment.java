package com.hms.model;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "PAYMENTS")
public class Payment {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "PAYMENT_ID")
  private Long id;

  @ManyToOne(optional = false)
  @JoinColumn(name = "APPOINTMENT_ID")
  private Appointment appointment;

  @Column(name = "AMOUNT", nullable = false)
  private BigDecimal amount;

  @Column(name = "METHOD", nullable = false)
  private String method;

  @Column(name = "PAYMENT_STATUS", nullable = false)
  private String paymentStatus;

  @Column(name = "PAYMENT_DATE", insertable = false, updatable = false)
  private LocalDateTime paymentDate;

  public Payment() {}

  public Payment(Appointment appointment, BigDecimal amount, String method, String paymentStatus) {
    this.appointment = appointment;
    this.amount = amount;
    this.method = method;
    this.paymentStatus = paymentStatus;
  }

  public Long getId() {
    return id;
  }

  public Appointment getAppointment() {
    return appointment;
  }

  public void setAppointment(Appointment appointment) {
    this.appointment = appointment;
  }

  public BigDecimal getAmount() {
    return amount;
  }

  public void setAmount(BigDecimal amount) {
    this.amount = amount;
  }

  public String getMethod() {
    return method;
  }

  public void setMethod(String method) {
    this.method = method;
  }

  public String getPaymentStatus() {
    return paymentStatus;
  }

  public void setPaymentStatus(String paymentStatus) {
    this.paymentStatus = paymentStatus;
  }

  public LocalDateTime getPaymentDate() {
    return paymentDate;
  }
}
