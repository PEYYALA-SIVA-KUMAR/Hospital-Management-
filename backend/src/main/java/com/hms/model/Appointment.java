package com.hms.model;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "APPOINTMENTS")
public class Appointment {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "APPOINTMENT_ID")
  private Long id;

  @ManyToOne(optional = false)
  @JoinColumn(name = "USER_ID")
  private User user;

  @ManyToOne(optional = false)
  @JoinColumn(name = "DOCTOR_ID")
  private Doctor doctor;

  @Column(name = "PROBLEM_DESCRIPTION")
  private String problemDescription;

  @Column(name = "APPOINTMENT_DATE", nullable = false)
  private LocalDate appointmentDate;

  @Column(name = "STATUS", nullable = false)
  private String status;

  @Column(name = "CREATED_AT", insertable = false, updatable = false)
  private LocalDateTime createdAt;

  public Appointment() {}

  public Appointment(User user, Doctor doctor, String problemDescription, LocalDate appointmentDate, String status) {
    this.user = user;
    this.doctor = doctor;
    this.problemDescription = problemDescription;
    this.appointmentDate = appointmentDate;
    this.status = status;
  }

  public Long getId() {
    return id;
  }

  public User getUser() {
    return user;
  }

  public void setUser(User user) {
    this.user = user;
  }

  public Doctor getDoctor() {
    return doctor;
  }

  public void setDoctor(Doctor doctor) {
    this.doctor = doctor;
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

  public String getStatus() {
    return status;
  }

  public void setStatus(String status) {
    this.status = status;
  }

  public LocalDateTime getCreatedAt() {
    return createdAt;
  }
}
