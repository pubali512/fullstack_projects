
import {extractIdFromIdNameTag } from '../components/Utils';

/*
export const projects = [
    { id: 'ABC123', name: 'Project Alpha', description: 'Description for Project Alpha' },
    { id: 'DEF456', name: 'Project Beta', description: 'Description for Project Beta' },
    { id: 'GHI789', name: 'Project Gamma', description: 'Description for Project Gamma' },
    { id: 'JKL012', name: 'Project Delta', description: 'Description for Project Delta' },
    { id: 'MNO345', name: 'Project Epsilon', description: 'Description for Project Epsilon' },
];

export const tasks = [
    { id: 'TAS001', projectId: 'ABC123', name: 'Design UI', description: 'Create wireframes and mockups' },
    { id: 'TAS002', projectId: 'ABC123', name: 'Backend API', description: 'Develop RESTful API' },
    { id: 'TAS003', projectId: 'DEF456', name: 'Database Migration', description: 'Migrate data to new schema' },
    { id: 'TAS004', projectId: 'GHI789', name: 'User Testing', description: 'Conduct user testing sessions' },
    { id: 'TAS005', projectId: 'JKL012', name: 'Deployment', description: 'Deploy application to production' },
    { id: 'TAS006', projectId: 'MNO345', name: 'Performance Review', description: 'Review application performance metrics' },
    { id: 'TAS007', projectId: 'ABC123', name: 'Code Review', description: 'Review and refactor frontend code' },
    { id: 'TAS008', projectId: 'DEF456', name: 'API Documentation', description: 'Write comprehensive API documentation' },
    { id: 'TAS009', projectId: 'GHI789', name: 'Bug Fixes', description: 'Address critical bugs and issues' },
    { id: 'TAS010', projectId: 'JKL012', name: 'Security Audit', description: 'Conduct security vulnerability assessment' },
    { id: 'TAS011', projectId: 'MNO345', name: 'Infrastructure Setup', description: 'Configure cloud infrastructure' },
];
*/

export const timeEntries = [
    { projectId: 'ABC123', taskId: 'TAS001', date: '2026-01-19', hours: 2, notes: 'Wireframes' },
    { projectId: 'DEF456', taskId: 'TAS002', date: '2026-01-19', hours: 3, notes: 'REST API setup' },
    { projectId: 'ABC123', taskId: 'TAS001', date: '2026-01-20', hours: 4, notes: 'Mockup refinement' },
    { projectId: 'DEF456', taskId: 'TAS003', date: '2026-01-21', hours: 5, notes: 'Schema design' },
    { projectId: 'ABC123', taskId: 'TAS002', date: '2026-01-22', hours: 3, notes: 'API integration' },
    { projectId: 'DEF456', taskId: 'TAS002', date: '2026-01-22', hours: 2, notes: 'Testing endpoints' },
    { projectId: 'ABC123', taskId: 'TAS001', date: '2026-01-23', hours: 6, notes: 'Final designs' },
    { projectId: 'DEF456', taskId: 'TAS003', date: '2026-01-24', hours: 4, notes: 'Data mapping' },
    { projectId: 'GHI789', taskId: 'TAS004', date: '2026-01-25', hours: 5, notes: 'User testing session 1' },
    { projectId: 'GHI789', taskId: 'TAS009', date: '2026-01-26', hours: 4, notes: 'Bug triage' },
    { projectId: 'JKL012', taskId: 'TAS005', date: '2026-01-27', hours: 6, notes: 'Production deployment' },
    { projectId: 'JKL012', taskId: 'TAS010', date: '2026-01-28', hours: 5, notes: 'Security assessment' },
    { projectId: 'MNO345', taskId: 'TAS006', date: '2026-01-29', hours: 3, notes: 'Performance metrics review' },
    { projectId: 'MNO345', taskId: 'TAS011', date: '2026-01-30', hours: 7, notes: 'Cloud infrastructure setup' },
    { projectId: 'ABC123', taskId: 'TAS007', date: '2026-02-01', hours: 4, notes: 'Frontend code review' },
    { projectId: 'DEF456', taskId: 'TAS008', date: '2026-02-02', hours: 3, notes: 'API documentation' },
    { projectId: 'ABC123', taskId: 'TAS002', date: '2026-02-02', hours: 3, notes: 'Bug fixes' },
    { projectId: 'DEF456', taskId: 'TAS001', date: '2026-02-02', hours: 2, notes: 'Documentation' },
    { projectId: 'GHI789', taskId: 'TAS004', date: '2026-02-03', hours: 4, notes: 'User testing session 2' },
    { projectId: 'JKL012', taskId: 'TAS005', date: '2026-02-04', hours: 3, notes: 'Post-deployment monitoring' },
    { projectId: 'MNO345', taskId: 'TAS006', date: '2026-02-05', hours: 5, notes: 'Load testing analysis' },
    { projectId: 'ABC123', taskId: 'TAS003', date: '2026-02-09', hours: 5, notes: 'Performance optimization' },
    { projectId: 'DEF456', taskId: 'TAS002', date: '2026-02-10', hours: 4, notes: 'Deployment preparation' },
];

/*
export function getTasks(task) {
    return tasks.filter(t => t.projectId === task.projectId);
}
*/

/**
 * Retrieves time entries for a specified week.
 * 
 * @param {string} mondayDate - The start date of the week (format: YYYY-MM-DD)
 * @returns {Array<Object>} An array of time entry objects containing projectId, taskId, date, hours, and notes
 * @example
 * const entries = getTimeEntriesForWeek('2026-01-25');
 * 
 */
export function getTimeEntriesForWeek(mondayDate) {

    const weekDates = [];
    const startDate = new Date(mondayDate);
    for (let i = 0; i < 7; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        weekDates.push(date.toISOString().split('T')[0]);
    }

    return timeEntries.filter(entry => weekDates.includes(entry.date));
}   

/* API Integration */
const API_PROJECTS = 'http://localhost:8080/api/projects';

// Create or update a project (depending on whether entry contains an id) 
export async function createProject(entry) {
  const res = await fetch(API_PROJECTS, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entry),
  });
  return res.json(); 
}

export async function updateProject(entry) {

  const projectId = extractIdFromIdNameTag(entry.projectId);
  let data = {projectId: projectId, 
    projectName: entry.projectName, 
    description: entry.description};

  const res = await fetch(API_PROJECTS, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json(); 
}

export async function createTask(entry) {

  // Extract projectId from the format "Project Name (ProjectID)"
  const projectId = extractIdFromIdNameTag(entry.projectId);
  const API_TASKS = `http://localhost:8080/api/projects/${projectId}/tasks`;

  const data = {taskId: entry.taskId, 
    taskName: entry.taskName, 
    description: entry.description};

  console.log(`Creating task for project ${projectId} with data:`, data);

  const res = await fetch(API_TASKS, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json(); 
}

export async function updateTask(entry) {

  // Extract projectId from the format "Project Name (ProjectID)"
  const projectId = extractIdFromIdNameTag(entry.projectId);
  const API_TASKS = `http://localhost:8080/api/projects/${projectId}/tasks`;

  const data = {taskId: extractIdFromIdNameTag(entry.taskId), 
    projectId: projectId,
    taskName: entry.taskName, 
    description: entry.description};

  console.log(`Creating task for project ${projectId} with data:`, data);

  const res = await fetch(API_TASKS, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json(); 
}


export async function getProjects() {
  const res = await fetch(API_PROJECTS);
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  return res.json();
}

/* Submit timesheet entry */
const API_TIMESHEETS = 'http://localhost:8080/api/timesheets';

export async function submitTimesheet(entry) {
  const res = await fetch(API_TIMESHEETS, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entry),
  });
  return res.json();
}

export async function getTimeEntries(startDateStr, endDateStr) {
  let currentDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);

  let allEntries = [];

  while (currentDate <= endDate) {
    
    const dateToApi = currentDate.toISOString().split('T')[0];

    try {
      console.log(`Calling API for: ${dateToApi}`);
      const response = await getTimeSheetEntriesForDate(dateToApi); 

      response.forEach(entry => {
        console.log(`Received entry for ${dateToApi}:`, entry);
        allEntries.push(entry);
      });

    } catch (error) {
      console.error(`Failed for ${dateToApi}`, error);
    }

     currentDate.setUTCDate(currentDate.getUTCDate() + 1);
  }
  console.log("Finished processing all dates!");
  return allEntries;
}

async function getTimeSheetEntriesForDate(date) {
  const endPoint = `${API_TIMESHEETS}/date/${date}`;
  console.log(`Fetching time entries for date: ${date} from endpoint: ${endPoint}`);
  const res = await fetch(endPoint);
  if (!res.ok) {
    throw new Error(`API call failed with status ${res.status} for date ${date}`);
  }
  return res.json();
}