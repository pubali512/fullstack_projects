# Timesheet 

## Backend Endpoints/Checks

- [X] Need new end point that returns all entries for a given date 
- [ ] Check in back-end whether a new project ID or a task ID already exists. If it does, return an error and do not create the new project/task. This ensures uniqueness of project IDs across the system and task IDs within each project. 

## Frontend 

- [X] Generate dashboard display. 
- [ ] Get per week data for a given week for the timesheet page. This will be used to populate the timesheet page with the correct entries for the selected week. 
- [ ] Task and project ID should contain only characters, underscores, hyphens and digits. Before creating a new project or task, validate the ID and return an error if it contains invalid characters.
- [ ] Project and task ID should be limited to a certain length. Before creating a new project or task, validate the ID length and return an error if it exceeds 15 characters.
- [ ] Generate display names for projects and tasks by combining their IDs with their names (e.g., "Project 1 (Website Redesign)", "Task 1 (Design Homepage)"). Limit them to a maximum N characters for better display in the UI. If the combined name exceeds N characters, truncate it and add an ellipsis (e.g., "Project 1 (Website Redesign...)" or "Task 1 (Design Homepage...)").
- [ ] Task ID need not be unique acoss projects, but should be unique within a project. Before creating a new task, check if a task with the same ID already exists within the same project and return an error if it does.
- [ ] Concatenate project ID and task ID to create a unique identifier for each task across the system (e.g., "project1##task1"). This can be used for API calls and internal state management to ensure that each task can be uniquely identified even if task IDs are not unique across projects.


## Testdata initialization
- [ ] Add a script in python that adds some test data to the database for easier testing and development (e.g., a few projects, tasks, and timesheet entries)

# Finance app 

## Frontend 

- [X] Setup basic React app with Vite 
- [X] Same as in timesheet, but with different pages (e.g., Dashboard, Categories, Transactions) 
- [ ] In the Categories page, implement functionality to add/edit/delete categories (similar to projects in timesheet) as well as subcategories (similar to tasks in timesheet) 
- [ ] In the Transactions page, implement functionality to add/edit/delete transactions (similar to timesheet entries) with fields for amount, date, category, subcategory, and description 
- [ ] In the Dashboard page, implement a simple overview of recent transactions and category breakdown (e.g., total spent per category)

## Backend 

- [ ] Setup a python based backend with Flask or FastAPI. 