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

    @PostMapping("/projects")
    public ResponseEntity<Project> createProject(@RequestBody Project project) {
        return ResponseEntity.ok(service.saveProject(project));
    }

    @GetMapping("/projects")
    public List<Project> getAllProjects() {
        return service.getAllProjects();
    }

    @GetMapping("/projects/{id}")
    public ResponseEntity<Project> getProjectById(@PathVariable String id) {
        return service.getProjectById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
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

    @PostMapping("/tasks/{taskId}/timesheets")
    public ResponseEntity<Timesheet> logTime(@PathVariable String taskId, @RequestBody Timesheet entry) {
        return ResponseEntity.ok(service.logTime(taskId, entry));
    }

    @GetMapping("/tasks/{taskId}/timesheets")
    public List<Timesheet> getTimesheetsByTask(@PathVariable String taskId) {
        // Make sure this method exists in your TimesheetService!
        return service.getTimesheetsByTask(taskId);
    }

    @GetMapping("/projects/{projectId}/total-hours")
    public ResponseEntity<Double> getTotalProjectHours(@PathVariable String projectId) {
        // This calls the logic you already wrote!
        Double total = service.calculateTotalProjectHours(projectId);
        return ResponseEntity.ok(total);
    }

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
