package com.medicalscan.backend.service;


import com.medicalscan.backend.dto.SeriesInfoDto;
import com.medicalscan.backend.dto.SeriesInfoList;
import com.medicalscan.backend.entity.Patient;
import com.medicalscan.backend.entity.Series;
import com.medicalscan.backend.entity.Study;
import com.medicalscan.backend.repository.ImageRepository;
import com.medicalscan.backend.repository.PatientScanRepository;
import com.medicalscan.backend.repository.SeriesRepository;
import com.medicalscan.backend.repository.StudyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@RequiredArgsConstructor
@Service
public class PatientScanService {

    private final PatientScanRepository patientScanRepository;
    private final StudyRepository studyRepository;
    private final SeriesRepository seriesRepository;
    private final ImageRepository imageRepository;


    // 모든 환자 영상 기록 가져오기
    public List<Map<String, Object>> getAllPatientRecords() {
        List<Map<String, Object>> resultList = new ArrayList<>();
        List<Patient> patients = patientScanRepository.findAll(); // 모든 환자 가져오기

        for (Patient patient : patients) {
            Map<String, Object> result = new HashMap<>();
            result.put("patient", patient);

            List<Study> studies = studyRepository.findByPid(patient.getPid());
            List<Map<String, Object>> studyDetails = new ArrayList<>();

            for (Study study : studies) {
                Map<String, Object> studyData = new HashMap<>();
                studyData.put("study", study);

                List<Series> seriesList = seriesRepository.findSeriesByStudykey(study.getStudykey());
                studyData.put("series", seriesList);

                studyDetails.add(studyData);
            }

            result.put("studyDetails", studyDetails);
            resultList.add(result);
        }

        return resultList;
    }

    // 모든 환자 영상 위치 정보 가져오기
    public List<SeriesInfoList> getSeriesListPatientRecords(SeriesInfoDto dto) {
        List<SeriesInfoList> list = seriesRepository.findSeriesInfoList(dto.getPid(), dto.getSeriesKey(), dto.getStudyKey());
        return list;
    }


}

