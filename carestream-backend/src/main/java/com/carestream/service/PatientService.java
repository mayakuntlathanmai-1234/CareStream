package com.carestream.service;

import com.carestream.model.Patient;
import com.carestream.model.User;
import com.carestream.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PatientService {
    @Autowired
    private PatientRepository patientRepository;

    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    public Optional<Patient> getPatientById(Long id) {
        return patientRepository.findById(id);
    }

    public Optional<Patient> getPatientByUser(User user) {
        return patientRepository.findByUser(user);
    }

    public Patient savePatient(Patient patient) {
        return patientRepository.save(patient);
    }
}
