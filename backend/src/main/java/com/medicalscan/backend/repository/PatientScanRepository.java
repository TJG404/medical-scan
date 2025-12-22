package com.medicalscan.backend.repository;

import com.medicalscan.backend.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PatientScanRepository extends JpaRepository<Patient, String> {
    List<Patient> findByPid(String pid);
    List<Patient> findByPnameContaining(String pname);
    List<Patient> findByPsex(String psex);
    List<Patient> findByPbirthdate(String pbirthdate);

}