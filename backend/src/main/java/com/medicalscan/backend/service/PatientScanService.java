package com.medicalscan.backend.service;


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

    // 환자 검사 정보 불러오기
//    public Map<String, Object> getPatientRecords(String pid) {
//        Map<String, Object> result = new HashMap<>();
//
//        // 환자 정보 조회
//        Optional<Patient> patient = patientRepository.findById(pid);
//        if (patient.isEmpty()) {
//            result.put("error", "환자 정보 없음!");
//            return result;
//        }
//        result.put("patient", patient.get());
//
//        // Study 조회
//        List<Study> studies = studyRepository.findByPid(pid);
//        result.put("studies", studies);
//
//        // 각 Study에 대한 Series 및 Image 조회
//        List<Map<String, Object>> studyDetails = new ArrayList<>();
//        for (Study study : studies) {
//            Map<String, Object> studyData = new HashMap<>();
//            studyData.put("study", study);
//
//            // 해당 Study의 Series 조회
//            List<Series> seriesList = seriesRepository.findSeriesByStudykey(study.getStudykey());
//            studyData.put("series", seriesList);
//
//            // 각 Series에 대한 Image 조회
//            List<Map<String, Object>> seriesDetails = new ArrayList<>();
//            for (Series series : seriesList) {
//                Map<String, Object> seriesData = new HashMap<>();
//                seriesData.put("series", series);
//
//                // Image 조회
//                List<Image> images = imageRepository.findByStudykeyAndSerieskey(series.getStudykey(), series.getSerieskey());
//                seriesData.put("images", images);
//
//                seriesDetails.add(seriesData);
//            }
//            studyData.put("seriesDetails", seriesDetails);
//            studyDetails.add(studyData);
//        }
//        result.put("studyDetails", studyDetails);
//
//        return result;
//    }

    // 이미지 불러오기
//    public List<Image> getImagesByStudyAndSeries(Integer studykey, Integer serieskey) {
//        return imageRepository.findByStudykeyAndSerieskey(studykey, serieskey);
//    }

    // 환자 정보 불러오기
//    public List<Patient> getPatientByPid(String pid) {
//        return patientRepository.findByPid(pid);
//    }

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
//
//    public List<Patient> searchPatients(String pid, String pname, String psex, String pbirthdate) {
//        if (pid != null && !pid.isEmpty()) {
//            return patientRepository.findByPid(pid);
//        }
//        if (pname != null && !pname.isEmpty()) {
//            return patientRepository.findByPnameContaining(pname);
//        }
//        if (psex != null && !psex.isEmpty()) {
//            return patientRepository.findByPsex(psex);
//        }
//        if (pbirthdate != null && !pbirthdate.isEmpty()) {
//            return patientRepository.findByPbirthdate(pbirthdate);
//        }
//        return patientRepository.findAll();
//    }

}

