package com.timesheetapp;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class TaskTotalDTO {
    private String taskId;
    private Double totalHours;

    public TaskTotalDTO(String taskId, Double totalHours) {
        this.taskId = taskId;
        this.totalHours = totalHours;
    }

}
