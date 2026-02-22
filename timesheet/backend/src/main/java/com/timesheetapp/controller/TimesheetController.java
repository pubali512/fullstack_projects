// API Access
package com.timesheetapp.controller;

import com.timesheetapp.TaskTotalDTO;
import com.timesheetapp.model.*;
import com.timesheetapp.service.TimesheetService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")         // Crucial for connecting to React/Angular/Vue
public class TimesheetController {

    private final TimesheetService service;

    // --- PROJECT ENDPOINTS ---
    /**
     * This manage the master project list
     **/

    @PostMapping("/projects")
    public ResponseEntity<Project> createProject(@RequestBody Project project) {
        return ResponseEntity.ok(service.saveProject(project));
    }

    @GetMapping("/projects")
    public List<Project> getAllProjects() {
        return service.getAllProjects();
    }


    // --- TASK ENDPOINTS ---

    @PostMapping("/projects/{projectId}/tasks")
    public ResponseEntity<Task> addTask(@PathVariable String projectId, @RequestBody Task task) {
        return ResponseEntity.ok(service.addTaskToProject(projectId, task));
    }

    @GetMapping("/projects/{projectId}/tasks")
    public List<Task> getTasksByProject(@PathVariable String projectId) {
        return service.getTasksByProject(projectId);
    }

    // --- TIMESHEET ENDPOINTS ---

    /**
     * POST /api/timesheets
     * This handles both INSERT and UPDATE (Upsert).
     * The JSON body now contains projectId and taskId.
     */
    @PostMapping("/timesheets")
    public ResponseEntity<Timesheet> logTime(@RequestBody Timesheet entry) {
        return ResponseEntity.ok(service.upsertTimesheet(entry));
    }

    /**
     * GET /api/timesheets/date/2025-12-19
     * Returns all logs across all projects/tasks for a specific day.
     */
    @GetMapping("/timesheets/date/{date}")
    public List<Timesheet> getByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return service.getEntriesByDate(date);
    }

    // --- AGGREGATION / REPORTING ENDPOINTS ---

    /**
     * GET /api/projects/{projectId}/total-hours
     * Uses the new optimized SQL SUM query.
     */
    @GetMapping("/projects/{projectId}/total-hours")
    public ResponseEntity<Double> getTotalProjectHours(@PathVariable String projectId) {
        Double total = service.calculateTotalProjectHours(projectId);
        return ResponseEntity.ok(total);
    }

    /**
     * GET /api/summary
     * Fetches grouped totals by taskId for a date range.
     */
    @GetMapping("/summary")
    public List<TaskTotalDTO> getSummary(
            @RequestParam("start") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam("end") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {
        return service.getTaskSummary(start, end);
    }
}



// Key Features of this Controller
//
//URL Hierarchy: Notice how the URLs follow the data structure. To add a task,
// go to /projects/{projectId}/tasks. This makes the API intuitive for frontend developers.
//
//ResponseEntity: Wrapped the returns in ResponseEntity.ok(). This is the professional
// way to handle HTTP responses, as it allows you to send back status codes
// (like 404 Not Found or 200 OK) correctly.
//
//JSON Mapping: The @RequestBody annotation automatically takes the JSON sent by the user
// and turns it into Java objects (Project, Task, etc.).
