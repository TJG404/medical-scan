package com.medicalscan.backend.entity;

import lombok.*;

import java.io.Serializable;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
public class SeriesId implements Serializable {

    private Integer  studykey;

    private Integer serieskey;
}
