# Timesheet Tracker

## Project Overview

A timesheet tracking application with a **Spring Boot REST API backend** and a **React single-page application frontend**. The app allows users to manage projects and tasks, log daily work hours, and view aggregated time summaries with visual analytics.

### Main Features

- **Projects & Tasks** — Create and edit projects with metadata (ID, name, description). Add tasks to projects with employee name, description, and notes
- **Weekly Time Logging** — Select a week via date picker, click on a day (Mon–Sun), and add time entries with project, task, hours, and notes. Submit all entries for a day with a single "Apply" action
- **Dashboard Analytics** — View aggregated time entries with filters: current week, current month, or custom date range. Grouped by project/task with total hours and percentage breakdown displayed with visual spark bars
- **Upsert Logic** — Time entries are intelligently upserted based on the unique combination of project, task, and day

## Technologies Used & Installation Instructions

### Technologies

#### Backend
- **Java 21**
- **Spring Boot 4.0** — Web framework
- **Spring Data JPA** — ORM and data access
- **SQLite** — Database with Hibernate Community Dialects (SQLiteDialect)
- **Lombok** — Boilerplate reduction
- **Maven** — Build and dependency management

#### Frontend
- **React 19** with **Vite 7**
- **React Router DOM 7** — Client-side routing
- **Custom CSS** — Styled with plain CSS (App.css, Common.css, Dashboard.css, Projects.css, Timesheet.css)
- **ESLint** — Code linting
- **Fetch API** — Native HTTP client (no Axios)

### Prerequisites

- **Backend:** Java 21, Maven 3.9+
- **Frontend:** Node.js (>= 18), npm

### Installation

#### Backend Setup

```bash
cd fullstack_projects/timesheet/backend
mvn clean install
```

#### Frontend Setup

```bash
cd fullstack_projects/timesheet/frontend
npm install
```

## Usage Instructions

### Starting the Application

#### 1. Start the Backend

```bash
cd fullstack_projects/timesheet/backend
mvn spring-boot:run
```

The Spring Boot server starts on `http://localhost:8080`.

#### 2. Start the Frontend

```bash
cd fullstack_projects/timesheet/frontend
npm run dev
```

The Vite dev server starts on `http://localhost:5173`.

#### 3. Open the Application

Navigate to `http://localhost:5173` in your browser.

### Frontend Routes

| Path          | Page       | Description                                    |
|---------------|------------|------------------------------------------------|
| `/`           | Dashboard  | Time summary with date range filters           |
| `/projects`   | Projects   | Create/edit projects and tasks                 |
| `/timesheet`  | Timesheet  | Weekly time logging with day-based entry       |

### API Endpoints

| Method | Endpoint                                | Description                                        |
|--------|-----------------------------------------|----------------------------------------------------|
| POST   | `/api/projects`                         | Create or update a project (upsert)                |
| GET    | `/api/projects`                         | List all projects with their tasks                 |
| POST   | `/api/projects/{projectId}/tasks`       | Add a task to a project                            |
| GET    | `/api/projects/{projectId}/tasks`       | List tasks for a specific project                  |
| POST   | `/api/timesheets`                       | Log a time entry (upsert by project+task+day)      |
| GET    | `/api/timesheets/date/{date}`           | Get time entries for a specific date               |
| GET    | `/api/projects/{projectId}/total-hours` | Get total hours for a project                      |
| GET    | `/api/summary?start=&end=`             | Grouped totals by task for a date range            |

### Data Model

- **Project** — `projectId` (String PK), `projectName`, `description`. One-to-many → Tasks
- **Task** — `taskId` (String PK), `taskName`, `employeeName`, `description`, `note`. Many-to-one → Project
- **Timesheet** — `id` (Long, auto-generated), `projectId`, `taskId`, `employeeName`, `day` (LocalDate), `hours` (Double), `note`. Unique constraint on (`projectId`, `taskId`, `day`)

### Configuration

| Setting             | Location                                          | Value                      |
|---------------------|---------------------------------------------------|----------------------------|
| Database            | `application.properties`                          | `sqlite:timesheet.db`      |
| Hibernate DDL       | `application.properties`                          | `update` (auto DDL)        |
| Backend API URL     | Frontend source (hardcoded)                       | `http://localhost:8080/api` |
| CORS                | `@CrossOrigin(origins = "*")` on controllers      | All origins allowed        |

### Project Structure

```
timesheet/
├── backend/
│   ├── pom.xml                        # Maven build config (Spring Boot 4, Java 21)
│   ├── mvnw / mvnw.cmd               # Maven wrapper scripts
│   └── src/main/
│       ├── java/.../timesheet/
│       │   ├── TimesheetBackendApplication.java  # Spring Boot entry point
│       │   ├── model/                 # JPA entities (Project, Task, Timesheet)
│       │   ├── dto/                   # Data transfer objects (TaskTotalDTO)
│       │   ├── repository/            # Spring Data JPA repositories
│       │   ├── service/               # Business logic services
│       │   └── controller/            # REST controllers
│       └── resources/
│           └── application.properties # Database and Hibernate config
├── frontend/
│   ├── package.json                   # Node.js dependencies
│   ├── vite.config.js                 # Vite config with React plugin
│   ├── index.html                     # HTML entry point
│   └── src/
│       ├── App.jsx                    # Root component with routing
│       ├── App.css                    # Global styles
│       ├── main.jsx                   # React entry point
│       ├── components/                # Reusable UI components
│       ├── pages/                     # Page components (Dashboard, Projects, Timesheet)
│       └── services/                  # API client and test data
└── desktop/                           # Desktop client (placeholder, currently empty)
```
