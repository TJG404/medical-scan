package com.medicalscan.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;

@Getter
@Entity
@Table(name = "seriestab", schema = "pacsplus")
@IdClass(SeriesId.class)
public class Series {

    @Id
    private Integer  studykey;

    @Id
    private Integer serieskey;

    private String studyinsuid;

    @Column(unique=true)
    private String seriesinsuid;
    private String seriesnum;
    private String modality;
    private String seriesdate;
    private String seriestime;
    private String bodypart;
    private String seriesdesc;
    private Integer imagecnt;
    private Integer delflag;
}
