# Timesheet 

## Backend Endpoints 

- Need new end point that returns all entries for a given date 

## Frontend 

- Task and project ID should contain only characters, underscores, hyphens and digits. Before creating a new project or task, validate the ID and return an error if it contains invalid characters.
- Generate display names for projects and tasks by combining their IDs with their names (e.g., "Project 1: Website Redesign", "Task 1: Design Homepage"). Limit them to a maximum of 30 characters for better display in the UI. If the combined name exceeds 30 characters, truncate it and add an ellipsis (e.g., "Project 1: Website Redesign..." or "Task 1: Design Homepage...").
- Task ID need not be unique acoss projects, but should be unique within a project. Before creating a new task, check if a task with the same ID already exists within the same project and return an error if it does.


## Testdata initialization
- Add a script in python that adds some test data to the database for easier testing and development (e.g., a few projects, tasks, and timesheet entries)

# Finance app 

## Frontend 

- Setup basic React app with Vite 
- Same as in timesheet, but with different pages (e.g., Dashboard, Categories, Transactions) 
- In the Categories page, implement functionality to add/edit/delete categories (similar to projects in timesheet) as well as subcategories (similar to tasks in timesheet) 
- In the Transactions page, implement functionality to add/edit/delete transactions (similar to timesheet entries) with fields for amount, date, category, subcategory, and description 
- In the Dashboard page, implement a simple overview of recent transactions and category breakdown (e.g., total spent per category)