package com.carestream;

import com.carestream.model.*;
import com.carestream.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Override
    public void run(String... args) throws Exception {
        // Seed Roles
        if (roleRepository.count() == 0) {
            roleRepository.save(new Role(ERole.ROLE_ADMIN));
            roleRepository.save(new Role(ERole.ROLE_DOCTOR));
            roleRepository.save(new Role(ERole.ROLE_PATIENT));
        }

        // Seed Admin
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User("admin", "admin@carestream.com", encoder.encode("admin123"));
            Set<Role> roles = new HashSet<>();
            Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                    .orElseThrow(() -> new RuntimeException("Error: Role ADMIN not found. Check database seeding."));
            roles.add(adminRole);
            admin.setRoles(roles);
            userRepository.save(admin);
        }

        // Seed Doctors
        if (doctorRepository.count() == 0) {
            createDoctor("janesmith", "Jane Smith", "Cardiology", "Mon-Wed, 9AM-2PM");
            createDoctor("robertbrown", "Robert Brown", "Neurology", "Tue-Thu, 10AM-4PM");
            createDoctor("sarahwilson", "Sarah Wilson", "Pediatrics", "Mon-Fri, 8AM-12PM");
        }
        
        // Seed a sample patient
        if (!userRepository.existsByUsername("john_doe")) {
            User user = new User("john_doe", "john@example.com", encoder.encode("patient123"));
            Set<Role> roles = new HashSet<>();
            Role patientRole = roleRepository.findByName(ERole.ROLE_PATIENT)
                    .orElseThrow(() -> new RuntimeException("Error: Role PATIENT not found."));
            roles.add(patientRole);
            user.setRoles(roles);
            User savedUser = userRepository.save(user);

            Patient patient = new Patient();
            patient.setName("John Doe");
            patient.setGender("Male");
            patient.setContactNumber("1234567890");
            patient.setAddress("123 Main St, New York");
            patient.setDateOfBirth(LocalDate.of(1990, 5, 15));
            patient.setUser(savedUser);
            patientRepository.save(patient);
        }
    }

    private void createDoctor(String username, String name, String spec, String avail) {
        User user = new User(username, username + "@carestream.com", encoder.encode("doctor123"));
        Set<Role> roles = new HashSet<>();
        Role doctorRole = roleRepository.findByName(ERole.ROLE_DOCTOR)
                .orElseThrow(() -> new RuntimeException("Error: Role DOCTOR not found."));
        roles.add(doctorRole);
        user.setRoles(roles);
        User savedUser = userRepository.save(user);

        Doctor doctor = new Doctor();
        doctor.setName(name);
        doctor.setSpecialization(spec);
        doctor.setAvailability(avail);
        doctor.setContactNumber("9876543210");
        doctor.setUser(savedUser);
        doctorRepository.save(doctor);
    }
}
