// Business Logic
package com.timesheetapp.service;

import com.timesheetapp.TaskTotalDTO;
import com.timesheetapp.model.*;
import com.timesheetapp.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor        // Automatically injects the 3 repositories via constructor
public class TimesheetService {

    private final ProjectRepository projectRepo;
    private final TaskRepository taskRepo;
    private final TimesheetRepository timesheetRepo;

    // --- PROJECT & TASK OPERATIONS ---

    public Project saveProject(Project project) {
        return projectRepo.save(project);
    }

    public List<Project> getAllProjects() {
        return projectRepo.findAll();
    }

    @Transactional
    public Task addTaskToProject(String projectId, Task task) {
        Project project = projectRepo.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        task.setProject(project);        // Establish bidirectional link
        return taskRepo.save(task);      // Save Task
    }

    public List<Task> getTasksByProject(String projectId) {
        // This allows the Controller to fetch tasks for the dropdown menu
        return taskRepo.findByProject_ProjectId(projectId);
    }

    // --- TIMESHEET OPERATIONS ---

    /**
     * Implementation of the Upsert Strategy:
     * 1. Checks if a record exists for the Project + Task + Date.
     * 2. If yes, updates the existing record.
     * 3. If no, creates a new one.
     */
    @Transactional
    public Timesheet upsertTimesheet(Timesheet entry) {
        // Search for existing record by the unique composite key
        Optional<Timesheet> existing = timesheetRepo.findByProjectIdAndTaskIdAndDay(
                entry.getProjectId(),
                entry.getTaskId(),
                entry.getDay()
        );

        if (existing.isPresent()) {
            // UPDATE logic
            Timesheet existingRecord = existing.get();
            existingRecord.setHours(entry.getHours());
            existingRecord.setEmployeeName(entry.getEmployeeName());
            existingRecord.setNote(entry.getNote());
            return timesheetRepo.save(existingRecord);
        } else {
            // INSERT logic
            return timesheetRepo.save(entry);
        }
    }

    // List of all logs for a specific day
    public List<Timesheet> getEntriesByDate(LocalDate day) {
        return timesheetRepo.findByDay(day);
    }

    // --- AGGREGATION LOGIC ---

    /**
     * Calculates total hours for a project.
     **/
    public Double calculateTotalProjectHours(String projectId) {
        Double total = timesheetRepo.sumHoursByProjectId(projectId);
        return (total != null) ? total : 0.0;           // Return 0 if no hours found
    }

    /**
     * Fetches the total hours grouped by task for a specific date range.
     */
    public List<TaskTotalDTO> getTaskSummary(LocalDate start, LocalDate end) {
        return timesheetRepo.getTotalHoursByTask(start, end);
    }
}


// Note:
// @Transactional: Added this to addTaskToProject and logTime. In a relational database,
// updating two things at once (like adding a task to a project's list), @Transactional
// ensures that if the power goes out mid-save, nothing is partially written. It’s "all or nothing."
//
//Object Mapping: A taskId is not just saved  as a String, also find the actual Task object
// and call entry.setTask(task). This allows Hibernate to handle the SQLite Foreign Key correctly.
//
//Stream API: In calculateTotalProjectHours, Java Streams use to "flatten" the data
// (Project → Tasks → Timesheets) and sum up the hours. This is much faster and cleaner than
// writing multiple nested for loops.
