package com.timesheetapp.repository;

import com.timesheetapp.model.Timesheet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

@Repository
public interface TimesheetRepository extends JpaRepository<Timesheet, Long> {

    // Using @Query tells Spring exactly which field to look at
    // "t.task.id" means: look at the timesheet (t), find its task, then get that task's id.
    @Query("SELECT t FROM Timesheet t WHERE t.task.taskId = :taskId")
    List<Timesheet> findByTaskId(@Param("taskId") String taskId);
}
