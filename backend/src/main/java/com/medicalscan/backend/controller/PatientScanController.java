package com.medicalscan.backend.controller;

import com.medicalscan.backend.dto.PageDto;
import com.medicalscan.backend.dto.SeriesInfoDto;
import com.medicalscan.backend.entity.Patient;
import com.medicalscan.backend.entity.RadiologistReport;
import com.medicalscan.backend.repository.PatientRepository;
import com.medicalscan.backend.repository.SeriesRepository;
import com.medicalscan.backend.repository.StudyRepository;
import com.medicalscan.backend.service.PatientScanService;
import com.medicalscan.backend.service.PatientService;
import com.medicalscan.backend.service.RadiologistReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RequestMapping("/patientScan")
@RestController
public class PatientScanController {
    private final PatientScanService patientScanService;
    private final StudyRepository studyRepository;
    private final SeriesRepository seriesRepository;
    private final RadiologistReportService radiologistReportService;

    // 모든 환자 영상 기록 가져오기
    @GetMapping("/records/all")
    public ResponseEntity<?> getAllPatientRecords() {
        return ResponseEntity.ok(patientScanService.getAllPatientRecords());
    }

    // 모든 환자 영상 위치 정보 가져오기
    @PostMapping("/records/seriesList")
    public ResponseEntity<?> getSeriesListPatientRecords(@RequestBody SeriesInfoDto seriesInfoDto) {
        System.out.println(seriesInfoDto.getPid());
        System.out.println(seriesInfoDto.getSeriesKey());
        System.out.println(seriesInfoDto.getStudyKey());
        return ResponseEntity.ok(patientScanService.getSeriesListPatientRecords(seriesInfoDto));
    }

    // 판독 결과 보고서 가져오기
    @GetMapping("/latest/{pid}")
    public ResponseEntity<RadiologistReport> getLatestReport(@PathVariable String pid) {
        RadiologistReport report = radiologistReportService.getLatestReportByPatientId(pid);
        return ResponseEntity.ok(report);
    }
}

