package com.carestream.service;

import com.carestream.model.*;
import com.carestream.payload.request.SignupRequest;
import com.carestream.repository.PatientRepository;
import com.carestream.repository.DoctorRepository;
import com.carestream.repository.RoleRepository;
import com.carestream.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Service
public class AuthService {
    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PatientRepository patientRepository;

    @Autowired
    DoctorRepository doctorRepository;

    @Autowired
    PasswordEncoder encoder;

    @Transactional
    public User registerUser(SignupRequest signUpRequest) {
        // Create new user's account
        User user = new User(signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()));

        Set<String> strRoles = signUpRequest.getRole();
        Set<Role> roles = new HashSet<>();

        if (strRoles == null) {
            Role userRole = roleRepository.findByName(ERole.ROLE_PATIENT)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(userRole);
        } else {
            strRoles.forEach(role -> {
                switch (role) {
                    case "admin":
                        Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(adminRole);
                        break;
                    case "doctor":
                        Role docRole = roleRepository.findByName(ERole.ROLE_DOCTOR)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(docRole);
                        break;
                    default:
                        Role userRole = roleRepository.findByName(ERole.ROLE_PATIENT)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(userRole);
                }
            });
        }

        user.setRoles(roles);
        User savedUser = userRepository.save(user);

        // If it's a patient registration, create a Patient entity too
        if (strRoles == null || strRoles.contains("patient")) {
            Patient patient = new Patient();
            patient.setName(signUpRequest.getName());
            patient.setContactNumber(signUpRequest.getContactNumber());
            patient.setAddress(signUpRequest.getAddress());
            patient.setGender(signUpRequest.getGender());
            if (signUpRequest.getDateOfBirth() != null) {
                patient.setDateOfBirth(LocalDate.parse(signUpRequest.getDateOfBirth()));
            }
            patient.setUser(savedUser);
            patientRepository.save(patient);
        } else if (strRoles.contains("doctor")) {
            Doctor doctor = new Doctor();
            doctor.setName(signUpRequest.getName());
            doctor.setContactNumber(signUpRequest.getContactNumber());
            doctor.setSpecialization(signUpRequest.getSpecialization() != null ? signUpRequest.getSpecialization() : "General Practice");
            doctor.setAvailability(signUpRequest.getAvailability() != null ? signUpRequest.getAvailability() : "Mon-Fri 9AM-5PM");
            doctor.setUser(savedUser);
            doctorRepository.save(doctor);
        }

        return savedUser;
    }
}
