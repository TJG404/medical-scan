package com.medicalscan.backend.entity;

import lombok.*;

import java.io.Serializable;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
public class ImageId implements Serializable {
    private Integer studykey;
    private Integer serieskey;
    private Integer imagekey;
}
