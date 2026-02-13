// dateStr is in YYYY-MM-DD format 
export function getMondayOfCurrentWeek() {
    const today = new Date();
    return getMondayOfWeek(today.toISOString().split('T')[0]);

};

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

/* user.email=94544796+KingK412@users.noreply.github.com 
   user.name=Pubali Mazumder
   user.email=pubali.k.m@googlemail.com*/