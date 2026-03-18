package com.hms.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public class AppointmentRequest {
  @NotNull
  private Long doctorId;

  @NotBlank
  private String problemDescription;

  @NotNull
  @JsonFormat(pattern = "yyyy-MM-dd")
  private LocalDate appointmentDate;

  public Long getDoctorId() {
    return doctorId;
  }

  public void setDoctorId(Long doctorId) {
    this.doctorId = doctorId;
  }

  public String getProblemDescription() {
    return problemDescription;
  }

  public void setProblemDescription(String problemDescription) {
    this.problemDescription = problemDescription;
  }

  public LocalDate getAppointmentDate() {
    return appointmentDate;
  }

  public void setAppointmentDate(LocalDate appointmentDate) {
    this.appointmentDate = appointmentDate;
  }
}
