package com.hms.service;

import com.hms.model.Doctor;
import com.hms.repository.DoctorRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DoctorService {
  private final DoctorRepository doctorRepository;

  public DoctorService(DoctorRepository doctorRepository) {
    this.doctorRepository = doctorRepository;
  }

  public List<Doctor> getAll() {
    return doctorRepository.findAll();
  }

  public Doctor getById(Long id) {
    return doctorRepository.findById(id)
      .orElseThrow(() -> new IllegalArgumentException("Doctor not found"));
  }
}
