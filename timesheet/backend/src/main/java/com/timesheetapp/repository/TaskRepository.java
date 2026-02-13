package com.timesheetapp.repository;

import com.timesheetapp.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, String> {
    // This allows to find all tasks linked to a specific Project String ID
    List<Task> findByProject_ProjectId(String projectId);
}
