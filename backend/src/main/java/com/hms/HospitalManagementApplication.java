package com.hms;

import com.hms.model.Doctor;
import com.hms.repository.DoctorRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.List;

@SpringBootApplication
public class HospitalManagementApplication {
  public static void main(String[] args) {
    SpringApplication.run(HospitalManagementApplication.class, args);
  }

  @Bean
  CommandLineRunner seedDoctors(DoctorRepository repository) {
    return args -> {
      if (repository.count() > 0) {
        return;
      }
      List<Doctor> doctors = List.of(
        new Doctor("Dr. Aarav Menon", "Full Body Checkup", "/assets/img/doctor-body.svg"),
        new Doctor("Dr. Isha Rao", "General Physician", "/assets/img/doctor-general.svg"),
        new Doctor("Dr. Vikram Singh", "Heart Specialist", "/assets/img/doctor-heart.svg"),
        new Doctor("Dr. Neha Kapoor", "Orthopedic Doctor", "/assets/img/doctor-ortho.svg"),
        new Doctor("Dr. Ritu Sharma", "Skin Specialist", "/assets/img/doctor-skin.svg"),
        new Doctor("Dr. Kiran Das", "Eye Specialist", "/assets/img/doctor-eye.svg")
      );
      repository.saveAll(doctors);
    };
  }
}
