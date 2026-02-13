// Business Logic
package com.timesheetapp.service;

import com.timesheetapp.model.*;
import com.timesheetapp.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor        // Automatically injects the 3 repositories via constructor
public class TimesheetService {

    private final ProjectRepository projectRepo;
    private final TaskRepository taskRepo;
    private final TimesheetRepository timesheetRepo;

    // --- PROJECT OPERATIONS ---

    public Project saveProject(Project project) {
        return projectRepo.save(project);
    }

    public List<Project> getAllProjects() {
        return projectRepo.findAll();
    }

    public Optional<Project> getProjectById(String id) {
        return projectRepo.findById(id);
    }

    // --- TASK OPERATIONS ---

    @Transactional
    public Task addTaskToProject(String projectId, Task task) {
        // Find the parent Project
        Project project = projectRepo.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Cannot add task: Project " + projectId + " not found"));

        // Establish the bidirectional link
        task.setProject(project);

        // Save the task
        return taskRepo.save(task);
    }

    public List<Task> getTasksByProject(String projectId) {

        return taskRepo.findByProject_ProjectId(projectId);
    }

    // --- TIMESHEET OPERATIONS ---

    @Transactional
    public Timesheet logTime(String taskId, Timesheet entry) {
        // Find the parent Task
        Task task = taskRepo.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Cannot log time: Task " + taskId + " not found"));

        // Link the timesheet entry to the specific task
        entry.setTask(task);

        return timesheetRepo.save(entry);
    }

    public List<Timesheet> getTimesheetsByTask(String taskId) {
        return timesheetRepo.findByTaskId(taskId);
    }

    // --- AGGREGATION LOGIC ---

    /**
     * Calculates the total hours logged for an entire project
     * by summing all timesheets across all tasks.
     **/
    public Double calculateTotalProjectHours(String projectId) {
        List<Task> tasks = taskRepo.findByProject_ProjectId(projectId);

        return tasks.stream()
                .flatMap(task -> task.getTimesheets().stream())
                .mapToDouble(Timesheet::getHours)
                .sum();
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
