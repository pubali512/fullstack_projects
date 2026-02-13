// Database Tools
// Repository: Handles the data (Saving/Loading from SQLite).
// Repository acts as a mediator between Java code and database (SQLite).
package com.timesheetapp.repository;

import com.timesheetapp.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjectRepository extends JpaRepository<Project, String> {
    // String is used here because Project ID is a String
}
