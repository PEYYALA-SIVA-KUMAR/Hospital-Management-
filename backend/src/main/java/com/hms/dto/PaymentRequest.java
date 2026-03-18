package com.hms.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public class PaymentRequest {
  @NotNull
  private Long appointmentId;

  @NotNull
  private BigDecimal amount;

  @NotBlank
  private String method;

  public Long getAppointmentId() {
    return appointmentId;
  }

  public void setAppointmentId(Long appointmentId) {
    this.appointmentId = appointmentId;
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
}
