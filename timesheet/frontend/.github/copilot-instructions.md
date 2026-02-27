# Copilot Instructions for Timesheet Frontend

## Project Overview
React + Vite timesheet tracking application connecting to a backend REST API. The app manages projects, tasks, and time entries with three main pages: Dashboard (analytics), Projects (CRUD), and Timesheet (weekly time entry).

## Architecture & Component Layout

### Core Structure
- **App root**: [src/app/App.jsx](src/app/App.jsx) - Sets up BrowserRouter, NavBar, and Routes
- **State management**: Lifted to App level - `projects` state passed down to Projects and Timesheet pages
- **API layer**: [src/services/Api.js](src/services/Api.js) - All backend calls go through this module
- **UI components**: [src/components/UIComponents.jsx](src/components/UIComponents.jsx) - Shared components (currently just AlertPopup)
- **Utilities**: [src/components/Utils.jsx](src/components/Utils.jsx) - Helper functions for date math, data extraction, task queries

### Page Components
- **Dashboard** ([src/pages/Dashboard.jsx](src/pages/Dashboard.jsx)): Displays time entries with filtering by week/month/custom date range. Uses `getTimeEntries()` API
- **Projects** ([src/pages/Projects.jsx](src/pages/Projects.jsx)): Create/edit projects and tasks. Form state managed locally with `FormState` object containing separate sub-forms
- **Timesheet** ([src/pages/Timesheet.jsx](src/pages/Timesheet.jsx)): Weekly time entry grid. Organizes data by day-of-week with nested entry arrays

## Key Data Models

### Project Structure
```javascript
{
  projectId: "ABC123",
  projectName: "Project Alpha",
  description: "...",
  tasks: [{ taskId, taskName, description }, ...]
}
```

### Time Entry Structure
```javascript
{
  projectId: "ABC123",
  taskId: "TAS001",
  date: "2026-02-01",  // YYYY-MM-DD format
  hours: 4,
  notes: "Brief description"
}
```

### Timesheet Page State Structure
Organized by day-of-week with arrays of entries:
```javascript
{
  Monday: [{ projectId, taskId, hours, notes }, ...],
  Tuesday: [...],
  // ... through Sunday
}
```

## Critical Patterns

### Date Handling
All dates use **YYYY-MM-DD string format**. Utility functions in Utils.jsx handle conversions:
- `getMondayOfWeek(dateStr)` - Returns Monday of the week for any given date
- `getTimeEntriesForWeek(mondayDate)` - Filters entries for a 7-day week
- Date picker input → `getMondayOfWeek()` conversion in Timesheet and Dashboard

### Form State Management (Projects Page)
Nested form state with separate objects for each operation (`create_project`, `edit_project`, etc.). Generic handler `handleGenericInputChange()` updates nested state:
```javascript
setFormData(prev => ({
  ...prev,
  [formName]: { ...prev[formName], [name]: value }
}));
```

### ID Parsing Pattern
Data displays as `"ABC123 (Project Name)"` in dropdowns (created by `generateIdAndNameTag()`). Extract ID with `extractIdFromIdNameTag()` before API calls—this is critical for project and task creation/updates in Api.js.

### Task Queries
Use utility functions to traverse the project hierarchy:
- `getTasksForProject(projects, projectId)` - Returns task array for a project
- `getTasksForProjectAndTaskId()` - Returns single task object

## Backend API Endpoints

All calls prefixed with `http://localhost:8080/api/`:
- `GET /projects` - Fetch all projects
- `POST /projects` - Create/update project (same endpoint)
- `POST /projects/{projectId}/tasks` - Create/update task
- `GET /timesheets/date/{YYYY-MM-DD}` - Get entries for a date
- `POST /timesheets` - Submit time entry

**Note**: Projects and tasks use POST for both create and update operations.

## Build & Development Commands

```bash
npm run dev      # Start Vite dev server with HMR (port 5173)
npm run build    # Production build to dist/
npm run lint     # Run ESLint on all .js/.jsx files
npm run preview  # Preview production build locally
```

## Linting & Code Style

- **ESLint Config**: [eslint.config.js](eslint.config.js) - Uses React Hooks and React Refresh rules
- **Unused vars rule**: Allows CONSTANTS (uppercase pattern) in `no-unused-vars`
- No TypeScript; JSX inline styles preferred over external CSS where feasible

## Common Development Tasks

### Adding a new page
1. Create component in [src/pages/](src/pages/)
2. Import in [src/app/App.jsx](src/app/App.jsx)
3. Add Route and NavBar entry
4. Pass `projects` and `setProjects` if data editing needed

### Adding API integration
1. Add fetch function to [src/services/Api.js](src/services/Api.js)
2. Follow existing patterns: error handling, endpoint construction, console.log for debugging
3. Use `extractIdFromIdNameTag()` when parsing display strings into IDs

### Debugging
- Heavy use of `console.log()` throughout codebase for tracing state changes
- Check browser DevTools Network tab to verify API payloads match backend expectations
- Date format mismatches are common—verify YYYY-MM-DD format

## Styling

CSS organized by page/component: [src/styles/](src/styles/)
- [Common.css](src/styles/Common.css) - Shared styles
- [App.css](src/styles/App.css) - Main app layout
- `[PageName].css` - Page-specific styles

No CSS-in-JS framework; inline styles used for dynamic UI (see UIComponents.jsx overlay pattern).

## Known Issues & Future Considerations

- Dev server exit code 1 visible in terminal history—verify with `npm run dev` before committing
- Mock timesheet data in Api.js (commented out projects/tasks arrays)
- Consider extracting NavBar to separate component once more pages added
- API calls lack error boundaries; Dashboard filters may silently fail on date range queries
