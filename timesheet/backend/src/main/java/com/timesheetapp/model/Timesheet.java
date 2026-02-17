package com.timesheetapp.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Data
@Table(name = "timesheet", uniqueConstraints = {
        @UniqueConstraint(
                name = "uc_project_task_date",
                columnNames = {"projectId", "taskId", "day"})
        },
        indexes = {
            @Index(name = "idx_project_task_day", columnList = "projectId, taskId, day")
        }
)
public class Timesheet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    // Mandatory for database
    private Long id;                                             // Internal unique ID for the record.

    private String projectId;
    private String taskId;
    private String employeeName;
    private LocalDate day;                                       // Use LocalDate for proper date handling
    private Double hours;

    @Column(length = 1000)
    private String note;

    }
