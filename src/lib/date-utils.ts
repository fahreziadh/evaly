/**
 * Utility functions for consistent UTC ↔ Local timezone handling
 * 
 * Backend: Always stores UTC timestamps (milliseconds since epoch)
 * Frontend: Always displays/inputs in local timezone
 */

/**
 * Convert UTC timestamp to local datetime string for datetime-local input
 * @param utcTimestamp - UTC timestamp in milliseconds (from backend)
 * @returns Local datetime string formatted for datetime-local input (YYYY-MM-DDTHH:mm)
 */
export function utcToLocalDateTimeString(utcTimestamp: number | undefined): string {
  if (!utcTimestamp) return "";
  
  const date = new Date(utcTimestamp);
  // Get local date components
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

/**
 * Convert local datetime string to UTC timestamp for backend storage
 * @param localDateTimeString - Local datetime string from datetime-local input (YYYY-MM-DDTHH:mm)
 * @returns UTC timestamp in milliseconds for backend
 */
export function localDateTimeStringToUtc(localDateTimeString: string): number | undefined {
  if (!localDateTimeString) return undefined;
  
  // datetime-local value is already in local timezone
  // new Date() interprets it as local time automatically
  return new Date(localDateTimeString).getTime();
}

/**
 * Format UTC timestamp for display (e.g., "Dec 15, 2024 at 3:30 PM")
 * @param utcTimestamp - UTC timestamp in milliseconds
 * @returns Formatted local date/time string
 */
export function formatLocalDateTime(utcTimestamp: number | undefined): string {
  if (!utcTimestamp) return "";
  
  const date = new Date(utcTimestamp);
  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  };
  
  return date.toLocaleString('en-US', options);
}