/**
 * Utilities for extracting tasks from a project
 */

export function getTasksForProject(projects, projectId) {
  const project = projects.find(p => p.projectId === projectId);
  return project ? project.tasks || [] : [];
}

export function getTasksForProjectAndTaskId(projects, projectId, taskId) {
  const tasks = getTasksForProject(projects, projectId);
  return tasks.find(t => t.taskId === taskId);
}

/**
 * Utility function to extract project ID from a string in the format <projectID> (<projectName>) 
 */

export function extractIdFromIdNameTag(projectString) {
    return projectString.split(' (')[0];
}


/**
 * Date utility functions for timesheet calculations.
 * All dates are in YYYY-MM-DD format.
 */

export function getMondayOfCurrentWeek() {
    const today = new Date();
    return getMondayOfWeek(today.toISOString().split('T')[0]);

};

export function getSundayOfCurrentWeek() {
    const today = new Date();
    return getSundayOfWeek(today.toISOString().split('T')[0]);
}

export function getFirstDayOfCurrMonth() {
    const today = new Date();
    return getFirstDayOfMonth(today.toISOString().split('T')[0]);
}

export function getLastDayOfCurrMonth() {
    const today = new Date(); 
    return getLastDayOfMonth(today.toISOString().split('T')[0]);
}


/**
 * Gets the Monday of the week for a given date.
 * 
 * @param {string} dateStr - The date string to process (e.g., "2024-01-15")
 * @returns {string} The Monday of the week in YYYY-MM-DD format
 * 
 * @example
 * const monday = getMondayOfWeek("2024-01-17");
 * console.log(monday); // "2024-01-15"
 */
export function getMondayOfWeek(dateStr) {
    const tmpDate = new Date(dateStr);
    let dayIndex = tmpDate.getDay(); // 0 (Sun) to 6 (Sat)

    dayIndex = (dayIndex === 0) ? 7 : dayIndex; // Treat Sunday as 7 for easier calculations

    // Calculate how many days to move back to get to Monday
    // e.g., if today is Tuesday (2), we move back 1 day; 
    // if today is Sunday (7), we move back 6 days. 
    const diff = tmpDate.getDate() - (dayIndex - 1);
    const monday = new Date(tmpDate.setDate(diff));

    // Return in YYYY-MM-DD format for your HTML date input
    return monday.toISOString().split('T')[0];

}

export function getSundayOfWeek(dateStr) { 
    const tmpDate = new Date(dateStr);
    let dayIndex = tmpDate.getDay(); // 0 (Sun) to 6 (Sat)

    dayIndex = (dayIndex === 0) ? 7 : dayIndex; // Treat Sunday as 7 for easier calculations 

    // Calculate how many days to get to Sunday
    // e.g., if today is Tuesday (2), we move forward 5 days; 
    // if today is Sunday (7), we move forward 0 days.
    const diff = tmpDate.getDate() +  (7 - dayIndex);
    const sunday = new Date(tmpDate.setDate(diff));

    // Return in YYYY-MM-DD format for your HTML date input
    return sunday.toISOString().split('T')[0];

}

export function getFirstDayOfMonth(dateStr) {
    const today = new Date(dateStr);
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    return firstDay.toISOString().split('T')[0];
}

export function getLastDayOfMonth(dateStr) {
    const today = new Date(dateStr);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    return lastDay.toISOString().split('T')[0];
}
