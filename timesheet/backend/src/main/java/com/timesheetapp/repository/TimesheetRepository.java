package com.timesheetapp.repository;

import com.timesheetapp.TaskTotalDTO;
import com.timesheetapp.model.Timesheet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TimesheetRepository extends JpaRepository<Timesheet, Long> {

    // Using @Query tells Spring exactly which field to look at
    // "t.task.id" means: look at the timesheet (t), find its task, then get that task's id.
    @Query("SELECT t FROM Timesheet t WHERE t.task.taskId = :taskId")
    List<Timesheet> findByTaskId(@Param("taskId") String taskId);

    // New query for the total hours report
    @Query("SELECT new com.timesheetapp.TaskTotalDTO(t.task.taskId, SUM(t.hours)) " +
            "FROM Timesheet t " +
            "WHERE t.day BETWEEN :startDate AND :endDate " +
            "GROUP BY t.task.taskId")
    List<TaskTotalDTO> getTotalHoursByTask(@Param("startDate") LocalDate startDate,
                                           @Param("endDate") LocalDate endDate);
}
