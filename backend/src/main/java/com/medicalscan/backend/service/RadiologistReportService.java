package com.medicalscan.backend.service;

import com.medicalscan.backend.entity.RadiologistReport;
import com.medicalscan.backend.repository.RadiologistReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@RequiredArgsConstructor
@Service
public class RadiologistReportService {

    private final RadiologistReportRepository radiologistReportRepository;

    //    // 특정 시리즈 UID 기준으로 판독 데이터 가져오기
    public RadiologistReport getLatestReportByPatientId(String patientId) {
        return radiologistReportRepository.findLatestReportByPatientId(patientId);
    }

}
