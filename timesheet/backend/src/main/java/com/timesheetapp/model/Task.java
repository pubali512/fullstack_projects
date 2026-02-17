package com.timesheetapp.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Entity
@Data
public class Task {
    @Id
    private String taskId;

    private String taskName;
    private String employeeName;
    private String description;

    @Column(length = 1000)                           // Allows for longer text in the note field
    private String note;

    // RELATIONSHIP 1: Linking back to the Project
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id")                // This stores the String ID from Project.java
    private Project project;

}
