package com.carestream.controller;

import com.carestream.model.Appointment;
import com.carestream.repository.AppointmentRepository;
import com.carestream.repository.DoctorRepository;
import com.carestream.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalPatients", patientRepository.count());
        stats.put("totalDoctors", doctorRepository.count());
        stats.put("totalAppointments", appointmentRepository.count());
        stats.put("totalRevenue", 1740000); // Mocked: 17.4L
        stats.put("revenueGrowth", 18.4);
        stats.put("videoConsults", 94);
        stats.put("satisfactionScore", 4.9);
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/appointments")
    public ResponseEntity<List<Appointment>> getAllAppointments() {
        return ResponseEntity.ok(appointmentRepository.findAll());
    }

    @Autowired
    private com.carestream.service.AuthService authService;

    @Autowired
    private com.carestream.repository.UserRepository userRepository;

    @org.springframework.web.bind.annotation.PostMapping("/register-doctor")
    public ResponseEntity<?> registerDoctor(@jakarta.validation.Valid @org.springframework.web.bind.annotation.RequestBody com.carestream.payload.request.SignupRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(new com.carestream.payload.response.MessageResponse("Error: Username is already taken!"));
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new com.carestream.payload.response.MessageResponse("Error: Email is already in use!"));
        }

        // Force role to consist solely of doctor for absolute security
        java.util.Set<String> roles = new java.util.HashSet<>();
        roles.add("doctor");
        signUpRequest.setRole(roles);

        authService.registerUser(signUpRequest);

        return ResponseEntity.ok(new com.carestream.payload.response.MessageResponse("Doctor registered successfully!"));
    }
}
