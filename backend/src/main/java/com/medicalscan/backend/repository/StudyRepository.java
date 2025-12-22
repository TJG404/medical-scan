package com.medicalscan.backend.repository;

import com.medicalscan.backend.entity.Study;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudyRepository extends JpaRepository<Study, Integer> {
    List<Study> findByPid(String pid);

    // 각각 검색
    @Query("SELECT s FROM Study s WHERE " +
            "(:pid IS NULL OR s.pid = :pid) AND " +
            "(:pname IS NULL OR LOWER(s.pname) LIKE LOWER(CONCAT('%', :pname, '%'))) AND " +
            "(:studydateStart IS NULL OR s.studydate >= :studydateStart) AND " +
            "(:studydateEnd IS NULL OR s.studydate <= :studydateEnd) AND " +
            "(:studydesc IS NULL OR LOWER(s.studydesc) LIKE LOWER(CONCAT('%', :studydesc, '%'))) AND " +
            "(:modality IS NULL OR LOWER(s.modality) = LOWER(:modality)) AND " +
            "(:accessnum IS NULL OR s.accessnum = :accessnum)")
    List<Study> findByCriteria(
            @Param("pid") String pid,
            @Param("pname") String pname,
            @Param("studydateStart") String studydateStart,
            @Param("studydateEnd") String studydateEnd,
            @Param("studydesc") String studydesc,
            @Param("modality") String modality,
            @Param("accessnum") String accessnum);

}

