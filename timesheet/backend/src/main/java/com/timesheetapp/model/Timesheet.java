package com.timesheetapp.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
    @Data
    public class Timesheet {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        // Mandatory for database
        private Long id;                                             // Internal unique ID for the record.

        private String employeeName;
        private LocalDate day;                                       // Use LocalDate for proper date handling
        private Double hours;

        @Column(length = 1000)
        private String note;

        // RELATIONSHIP: Linking back to the Task
        @JsonBackReference // This is the "Child" side that will be hidden to prevent the loop
        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "task_id", referencedColumnName = "taskId")    // This links to the 'taskId' String in Task.java
        private Task task;
    }
