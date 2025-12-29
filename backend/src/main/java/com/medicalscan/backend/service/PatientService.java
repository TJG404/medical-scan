package com.medicalscan.backend.service;

import com.medicalscan.backend.dto.PageDto;
import com.medicalscan.backend.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import com.medicalscan.backend.entity.Patient;

import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class PatientService {
    private final PatientRepository patientRepository;

    public Page<Patient> findAll(Pageable pageable) {
        Page<Patient> page = patientRepository.findAll(pageable);
        return page;
    }

    public int getTotalPages(Pageable pageable) {
        Page<Patient> page = patientRepository.findAll(pageable);
        return page.getTotalPages();
    }
    public Patient findPatientByPid(String pid) {
       Optional<Patient> patient = patientRepository.findById(pid);
       return patient.orElse(null);
    }


}
