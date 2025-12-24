package com.medicalscan.backend.dto;

import lombok.Data;

@Data
public class SeriesInfoDto {
    private String pid;
    private Long seriesKey;
    private Long studyKey;
}
