package com.medicalscan.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;

@Getter
@Entity
@Table(name = "studytab", schema = "pacsplus", uniqueConstraints = @UniqueConstraint(columnNames = {"studyinsuid", "pid"}))
public class Study {

    @Id
    private Integer studykey;

    @Column(nullable = false)
    private String studyinsuid;
    private String studydate;
    private String studytime;
    private String accessnum;
    private String studyid;

    @Column(length = 256)
    private String studydesc;

    private String modality;

    @Column(length = 256)
    private String bodypart;

    @Column(nullable = false)
    private String pid;
    private String pname;
    private String psex;
    private String pbirthdatetime;
    private String patage;
    private Integer seriescnt;
    private Integer imagecnt;
    private Integer delflag;
}
