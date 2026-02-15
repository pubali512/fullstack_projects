

// dateStr is in YYYY-MM-DD format 
export function getMondayOfCurrentWeek() {
    const today = new Date();
    return getMondayOfWeek(today.toISOString().split('T')[0]);

};

export function getSundayOfCurrentWeek() {
    const today = new Date();
    return getSundayOfCurrentWeek(today.toISOString().split('T')[0]);
}

export function getFirstDayOfCurrMonth(dateStr) {
    const today = new Date(dateStr); 
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    return firstDay.toISOString().split('T')[0];
}

export function getLastDayOfCurrMonth(dateStr) {
    const today = new Date(dateStr); 
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    return lastDay.toISOString().split('T')[0];
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
    const dayIndex = tmpDate.getDay(); // 0 (Sun) to 6 (Sat)

    // Calculate how many days to move back to get to Monday
    // If today is Sunday (0), we move back 6 days. 
    // Otherwise, we move back (dayIndex - 1) days.
    const diff = tmpDate.getDate() - dayIndex + (dayIndex === 0 ? -6 : 1);
    const monday = new Date(tmpDate.setDate(diff));

    // Return in YYYY-MM-DD format for your HTML date input
    return monday.toISOString().split('T')[0];

}

export function getSundayOfWeek(dateStr) { 
    const tmpDate = new Date(dateStr);
    const dayIndex = tmpDate.getDay(); // 0 (Sun) to 6 (Sat)

    // Calculate how many days to move back to get to Monday
    // If today is Sunday (0), we move back 6 days. 
    // Otherwise, we move back (dayIndex - 1) days.
    const diff = tmpDate.getDate() - dayIndex + (dayIndex === 0 ? -6 : 1);
    const sunday = new Date(tmpDate.setDate(diff));

    // Return in YYYY-MM-DD format for your HTML date input
    return sunday.toISOString().split('T')[0];

}

