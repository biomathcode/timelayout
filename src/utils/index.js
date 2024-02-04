/**
 * Changes the date part of a given datetime while keeping the time intact.
 *
 * @param {string} dateTime - The datetime in ISO format (e.g., "2022-01-15T12:30:00.000Z").
 * @param {string} newDate - The new date in ISO format whose date part will replace the original date.
 * @returns {string} - A new ISO string with the time from the original `dateTime` and the date from the provided `newDate`.
 */
export function changeDate(dateTime, newDate) {
  const originalTime = dateTime.split("T")[1]; // Extract time part from original dateTime
  return `${newDate.split("T")[0]}T${originalTime}`;
}

function cn(...classNames) {
  return classNames.filter(Boolean).join(" ");
}

export { cn };
