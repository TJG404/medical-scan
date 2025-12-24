package com.medicalscan.backend.dto;

import lombok.Getter;

@Getter
public class SeriesInfoList {
    private final String pid;
    private final Long studyKey;
    private final String path;
    private final String fname;
    private final Long seriesKey;

    public SeriesInfoList(String pid, Object studyKey, String path, String fname, Object seriesKey) {
        this.pid = pid;
        this.studyKey = toLong(studyKey);
        this.path = path;
        this.fname = fname;
        this.seriesKey = toLong(seriesKey);
    }

    private Long toLong(Object v) {
        if (v == null) return null;
        if (v instanceof Number n) return n.longValue();
        if (v instanceof String s) return Long.parseLong(s.trim());
        throw new IllegalArgumentException("Cannot convert to Long: " + v + " (" + v.getClass() + ")");
    }
}


