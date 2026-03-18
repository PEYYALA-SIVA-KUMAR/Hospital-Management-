package com.hms.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "DOCTORS")
public class Doctor {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "DOCTOR_ID")
  private Long id;

  @Column(name = "NAME", nullable = false)
  private String name;

  @Column(name = "SPECIALTY", nullable = false)
  private String specialty;

  @Column(name = "IMAGE_URL")
  private String imageUrl;

  @Column(name = "CREATED_AT", insertable = false, updatable = false)
  private LocalDateTime createdAt;

  public Doctor() {}

  public Doctor(String name, String specialty, String imageUrl) {
    this.name = name;
    this.specialty = specialty;
    this.imageUrl = imageUrl;
  }

  public Long getId() {
    return id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getSpecialty() {
    return specialty;
  }

  public void setSpecialty(String specialty) {
    this.specialty = specialty;
  }

  public String getImageUrl() {
    return imageUrl;
  }

  public void setImageUrl(String imageUrl) {
    this.imageUrl = imageUrl;
  }

  public LocalDateTime getCreatedAt() {
    return createdAt;
  }
}
