// Data Structure
package com.timesheetapp.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Entity
@Data
public class Project {
    @Id
    // Primary key
    private String projectId;

    private String projectName;
    private String description;

    // One Project -> Many Tasks
    // cascade = ALL ensures that if you delete this Project, its Tasks are deleted too
    @JsonManagedReference
    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Task> tasks;
}
