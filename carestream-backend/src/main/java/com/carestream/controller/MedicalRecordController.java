package com.carestream.controller;

import com.carestream.model.Doctor;
import com.carestream.model.MedicalRecord;
import com.carestream.model.Patient;
import com.carestream.model.User;
import com.carestream.payload.request.MedicalRecordRequest;
import com.carestream.repository.UserRepository;
import com.carestream.service.DoctorService;
import com.carestream.service.MedicalRecordService;
import com.carestream.service.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/medical-records")
public class MedicalRecordController {
    @Autowired
    private MedicalRecordService medicalRecordService;

    @Autowired
    private PatientService patientService;

    @Autowired
    private DoctorService doctorService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasAnyRole('PATIENT', 'DOCTOR', 'ADMIN')")
    public ResponseEntity<List<MedicalRecord>> getPatientRecords(@PathVariable Long patientId) {
        Patient patient = patientService.getPatientById(patientId).orElseThrow();
        return ResponseEntity.ok(medicalRecordService.getRecordsByPatient(patient));
    }

    @PostMapping
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<?> createRecord(@RequestBody MedicalRecordRequest request) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findByUsername(userDetails.getUsername()).orElseThrow();
        Doctor doctor = doctorService.getDoctorByUser(user).orElseThrow();
        Patient patient = patientService.getPatientById(request.getPatientId()).orElseThrow();

        MedicalRecord record = new MedicalRecord();
        record.setPatient(patient);
        record.setDoctor(doctor);
        record.setDiagnosis(request.getDiagnosis());
        record.setTreatment(request.getTreatment());
        record.setNotes(request.getNotes());
        record.setDate(LocalDate.now());

        return ResponseEntity.ok(medicalRecordService.saveRecord(record));
    }
}
