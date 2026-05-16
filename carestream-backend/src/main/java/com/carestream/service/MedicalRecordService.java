package com.carestream.service;

import com.carestream.model.MedicalRecord;
import com.carestream.model.Patient;
import com.carestream.repository.MedicalRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MedicalRecordService {
    @Autowired
    private MedicalRecordRepository medicalRecordRepository;

    public List<MedicalRecord> getRecordsByPatient(Patient patient) {
        return medicalRecordRepository.findByPatient(patient);
    }

    public MedicalRecord saveRecord(MedicalRecord record) {
        return medicalRecordRepository.save(record);
    }
}
