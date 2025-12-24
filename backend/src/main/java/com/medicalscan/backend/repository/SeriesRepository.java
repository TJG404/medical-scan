package com.medicalscan.backend.repository;

import com.medicalscan.backend.dto.SeriesInfoDto;
import com.medicalscan.backend.dto.SeriesInfoList;
import com.medicalscan.backend.entity.Series;
import com.medicalscan.backend.entity.SeriesId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SeriesRepository extends JpaRepository<Series, SeriesId> {

    public List<Series> findSeriesByStudykey(Integer studykey);


    @Query(value = """
        SELECT DISTINCT
            s1.pid          AS pid,
            s1.studykey     AS studyKey,
            i.path          AS path,
            i.fname         AS fname,
            i.serieskey     AS seriesKey
        FROM studytab s1
        JOIN seriestab s2 ON s1.studykey = s2.studykey
        JOIN imagetab i   ON s1.studykey = i.studykey
        WHERE s1.pid = :pid
          AND i.serieskey = :seriesKey
          AND s1.studykey = :studyKey
    """, nativeQuery = true)
    List<SeriesInfoList> findSeriesInfoList(
            @Param("pid") String pid,
            @Param("seriesKey") Long seriesKey,
            @Param("studyKey") Long studyKey
    );




}


