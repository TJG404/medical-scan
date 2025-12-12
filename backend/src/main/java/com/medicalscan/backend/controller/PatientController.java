package com.medicalscan.backend.controller;

import com.medicalscan.backend.dto.PageDto;
import com.medicalscan.backend.entity.Patient;
import com.medicalscan.backend.repository.PatientRepository;
import com.medicalscan.backend.service.PatientService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.util.List;

@RequiredArgsConstructor
@RequestMapping("/patients")
@RestController
public class PatientController {
    private final PatientRepository patientRepository;
    private final PatientService patientService;

    @PostMapping("/all")
    public Page<Patient> list(@RequestBody PageDto pageDto) {
        Pageable pageable = PageRequest.of(pageDto.getCurrentPage()-1, pageDto.getPageSize());
        Page<Patient> page = patientService.findAll(pageable);
        return page;
    }
}
