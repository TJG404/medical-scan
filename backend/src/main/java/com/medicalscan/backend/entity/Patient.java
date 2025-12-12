package com.medicalscan.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;

@Getter
@Entity
@Table(name = "patienttab", schema = "pacsplus")
public class Patient {

    @Id
    private String pid;

    private String pname;
    private String psex;
    private String pbirthdate;
}
