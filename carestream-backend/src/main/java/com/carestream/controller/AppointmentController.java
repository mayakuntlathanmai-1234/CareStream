package com.carestream.controller;

import com.carestream.model.Appointment;
import com.carestream.model.Doctor;
import com.carestream.model.Patient;
import com.carestream.model.User;
import com.carestream.payload.request.AppointmentRequest;
import com.carestream.repository.UserRepository;
import com.carestream.service.AppointmentService;
import com.carestream.service.DoctorService;
import com.carestream.service.PatientService;
import com.carestream.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {
    @Autowired
    private AppointmentService appointmentService;

    @Autowired
    private PatientService patientService;

    @Autowired
    private DoctorService doctorService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    @PostMapping
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<?> bookAppointment(@RequestBody AppointmentRequest request) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findByUsername(userDetails.getUsername()).orElseThrow();
        Patient patient = patientService.getPatientByUser(user).orElseThrow();
        Doctor doctor = doctorService.getDoctorById(request.getDoctorId()).orElseThrow();

        Appointment appointment = new Appointment();
        appointment.setPatient(patient);
        appointment.setDoctor(doctor);
        appointment.setAppointmentTime(request.getAppointmentTime());
        appointment.setReason(request.getReason());
        appointment.setStatus("PENDING");

        Appointment savedAppointment = appointmentService.saveAppointment(appointment);

        // Notify Doctor
        if (doctor.getUser() != null) {
            notificationService.sendUserNotification(
                doctor.getUser().getUsername(),
                "New appointment request from " + patient.getName(),
                "INFO"
            );
        }
        
        // Broadcast to admins
        notificationService.broadcastGlobalNotification(
            "New appointment booked: " + patient.getName() + " with Dr. " + doctor.getName(),
            "INFO"
        );

        return ResponseEntity.ok(savedAppointment);
    }

    @GetMapping("/patient")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<List<Appointment>> getPatientAppointments() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findByUsername(userDetails.getUsername()).orElseThrow();
        Patient patient = patientService.getPatientByUser(user).orElseThrow();
        return ResponseEntity.ok(appointmentService.getAppointmentsByPatient(patient));
    }

    @GetMapping("/doctor")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<List<Appointment>> getDoctorAppointments() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findByUsername(userDetails.getUsername()).orElseThrow();
        Doctor doctor = doctorService.getDoctorByUser(user).orElseThrow();
        return ResponseEntity.ok(appointmentService.getAppointmentsByDoctor(doctor));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('PATIENT') or hasRole('DOCTOR')")
    public ResponseEntity<?> getMyAppointments() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findByUsername(userDetails.getUsername()).orElseThrow();
        
        List<Appointment> appointments;
        if (user.getRoles().stream().anyMatch(r -> r.getName().name().equals("ROLE_DOCTOR"))) {
            Doctor doctor = doctorService.getDoctorByUser(user).orElseThrow();
            appointments = appointmentService.getAppointmentsByDoctor(doctor);
        } else {
            Patient patient = patientService.getPatientByUser(user).orElseThrow();
            appointments = appointmentService.getAppointmentsByPatient(patient);
        }
        
        List<Map<String, Object>> mapped = appointments.stream().map(a -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", a.getId());
            map.put("appointmentDate", a.getAppointmentTime() != null ? a.getAppointmentTime().toString() : null);
            map.put("status", a.getStatus());
            map.put("reason", a.getReason());
            if (a.getDoctor() != null) {
                map.put("doctorId", a.getDoctor().getId());
                map.put("doctorName", a.getDoctor().getName());
            }
            if (a.getPatient() != null) {
                map.put("patientId", a.getPatient().getId());
                map.put("patientName", a.getPatient().getName());
            }
            return map;
        }).collect(Collectors.toList());
        
        return ResponseEntity.ok(mapped);
    }

    @PutMapping("/{id}/confirm")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<?> confirmAppointment(@PathVariable Long id) {
        Appointment appointment = appointmentService.getAppointmentById(id).orElseThrow();
        appointment.setStatus("CONFIRMED");
        Appointment savedAppointment = appointmentService.saveAppointment(appointment);

        // Notify Patient
        if (appointment.getPatient().getUser() != null) {
            notificationService.sendUserNotification(
                appointment.getPatient().getUser().getUsername(),
                "Your appointment with Dr. " + appointment.getDoctor().getName() + " has been confirmed.",
                "SUCCESS"
            );
        }

        return ResponseEntity.ok(savedAppointment);
    }
}
