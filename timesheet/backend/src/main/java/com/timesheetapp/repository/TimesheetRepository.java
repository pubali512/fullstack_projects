package com.timesheetapp.repository;

import com.timesheetapp.TaskTotalDTO;
import com.timesheetapp.model.Timesheet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface TimesheetRepository extends JpaRepository<Timesheet, Long> {

    // --- BASIC LOOKUP QUERIES ---

    //  The unique key check (Upsert Logic)
    Optional<Timesheet> findByProjectIdAndTaskIdAndDay(String projectId, String taskId, LocalDate day);

    // By date endpoint
    List<Timesheet> findByDay(LocalDate day);

    // --- REPORTING & AGGREGATION QUERIES ---

    // Total hours for one specific project
    @Query("SELECT SUM(t.hours) FROM Timesheet t WHERE t.projectId = :projectId")
    Double sumHoursByProjectId(@Param("projectId") String projectId);

    // REQUIRED for the Summary Report (The math/aggregation)
    @Query("SELECT new com.timesheetapp.TaskTotalDTO(t.taskId, SUM(t.hours)) " +
            "FROM Timesheet t " +
            "WHERE t.day BETWEEN :startDate AND :endDate " +
            "GROUP BY t.taskId")
    List<TaskTotalDTO> getTotalHoursByTask(@Param("startDate") LocalDate startDate,
                                           @Param("endDate") LocalDate endDate);

    // OPTIONAL: Better for performance: Finds all entries for a task within a specific project
    // List<Timesheet> findByProjectIdAndTaskId(String projectId, String taskId);
}
