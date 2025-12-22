package com.medicalscan.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;
import lombok.Getter;

@Getter
@Entity
@Table(name = "imagetab", schema = "pacsplus")
@IdClass(ImageId.class) // 복합 키 클래스 추가
public class Image {

    @Id
    private Integer studykey;

    @Id
    private Integer serieskey;

    @Id
    private Integer imagekey;

    private String studyinsuid;
    private String seriesinsuid;
    private String sopinstanceuid;
    private String sopclassuid;
    private Integer ststorageid;
    private String path;
    private String fname;
    private Integer delflag;
}