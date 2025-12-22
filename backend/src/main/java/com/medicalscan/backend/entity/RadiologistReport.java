package com.medicalscan.backend.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "radiologist_reports")
public class RadiologistReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "report_code")
    private Integer reportCode; // 판독 코드 (PK)

    @Column(name = "series_ins_uid", nullable = false, length = 100)
    private String seriesInsUid; // DICOM Series UID

    @Column(name = "patient_id", nullable = false, length = 6)
    private String patientId; // 환자 ID

    @Column(name = "user_code", nullable = false)
    private Integer userCode; // 판독 의사 ID (FK)

    @Column(name = "approve_user_code")
    private Integer approveUserCode; // 승인 의사 ID (FK)

    @Column(name = "study_date", nullable = false)
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime studyDate; // 검사 날짜

    @Column(name = "approve_study_date")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime approveStudyDate; // 판독 승인 날짜

    @Column(name = "study_name", nullable = false, length = 50)
    private String studyName; // 검사 이름

    @Column(name = "modality", nullable = false, length = 20)
    private String modality; // 검사 장비

    @Column(name = "body_part", nullable = false, length = 50)
    private String bodyPart; // 검사 부위

    @Column(name = "patient_name", nullable = false, length = 100)
    private String patientName; // 환자 이름

    @Column(name = "patient_sex", nullable = false, length = 1)
    private String patientSex; // 환자 성별 ('M', 'F')

    @Column(name = "patient_birth_date", nullable = false)
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime patientBirthDate; // 환자 생년월일

    @Column(name = "patient_age", length = 4)
    private String patientAge; // 환자 나이

    @Column(name = "severity_level", nullable = false, length = 1)
    private String severityLevel; // 중증도 레벨 ('1' ~ '5')

    @Column(name = "report_status", nullable = false, length = 255)
    private String reportStatus; // 보고서 상태 ('Draft', 'Finalized', 'Needs Revision')

    @Column(name = "report_text", columnDefinition = "TEXT")
    private String reportText; // 판독 내용

    @Column(name = "reg_date", updatable = false, nullable = false)
    private LocalDateTime regDate = LocalDateTime.now(); // 등록일 (DEFAULT CURRENT_TIMESTAMP)

    @Column(name = "mod_date", nullable = false)
    private LocalDateTime modDate = LocalDateTime.now(); // 수정일 (DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)
}
