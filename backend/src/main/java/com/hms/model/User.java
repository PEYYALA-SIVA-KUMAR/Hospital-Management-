package com.hms.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "USERS")
public class User {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "USER_ID")
  private Long id;

  @Column(name = "FULL_NAME", nullable = false)
  private String fullName;

  @Column(name = "EMAIL", nullable = false, unique = true)
  private String email;

  @Column(name = "PASSWORD_HASH", nullable = false)
  @JsonIgnore
  private String passwordHash;

  @Column(name = "PHONE", nullable = false)
  private String phone;

  @Column(name = "AGE", nullable = false)
  private Integer age;

  @Column(name = "GENDER", nullable = false)
  private String gender;

  @Column(name = "CREATED_AT", insertable = false, updatable = false)
  private LocalDateTime createdAt;

  public User() {}

  public User(String fullName, String email, String passwordHash, String phone, Integer age, String gender) {
    this.fullName = fullName;
    this.email = email;
    this.passwordHash = passwordHash;
    this.phone = phone;
    this.age = age;
    this.gender = gender;
  }

  public Long getId() {
    return id;
  }

  public String getFullName() {
    return fullName;
  }

  public void setFullName(String fullName) {
    this.fullName = fullName;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getPasswordHash() {
    return passwordHash;
  }

  public void setPasswordHash(String passwordHash) {
    this.passwordHash = passwordHash;
  }

  public String getPhone() {
    return phone;
  }

  public void setPhone(String phone) {
    this.phone = phone;
  }

  public Integer getAge() {
    return age;
  }

  public void setAge(Integer age) {
    this.age = age;
  }

  public String getGender() {
    return gender;
  }

  public void setGender(String gender) {
    this.gender = gender;
  }

  public LocalDateTime getCreatedAt() {
    return createdAt;
  }
}
