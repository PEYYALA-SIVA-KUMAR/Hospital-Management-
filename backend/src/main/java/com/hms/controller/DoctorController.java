package com.hms.controller;

import com.hms.model.Doctor;
import com.hms.service.DoctorService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
public class DoctorController {
  private final DoctorService doctorService;

  public DoctorController(DoctorService doctorService) {
    this.doctorService = doctorService;
  }

  @GetMapping
  public List<Doctor> getDoctors() {
    return doctorService.getAll();
  }
}
