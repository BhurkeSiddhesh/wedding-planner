/**
 * Utility functions for Timeline and Split-Clock calculations
 */

/**
 * Converts "HH:mm" 24h string to minutes from midnight
 * e.g. "07:30" -> 450, "17:00" -> 1020
 */
export function timeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const parts = timeStr.trim().split(':');
  if (parts.length < 2) return 0;
  const hours = parseInt(parts[0], 10) || 0;
  const minutes = parseInt(parts[1], 10) || 0;
  return hours * 60 + minutes;
}

/**
 * Converts minutes from midnight to "HH:mm" 24h string
 */
export function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60) % 24;
  const m = Math.floor(minutes % 60);
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

/**
 * Formats "HH:mm" (24h) into clean "h:mm A" string
 * e.g. "07:00" -> "7:00 AM", "12:36" -> "12:36 PM", "17:00" -> "5:00 PM"
 */
export function formatTime12h(timeStr: string): string {
  if (!timeStr) return '';
  // If already contains AM/PM
  if (timeStr.toLowerCase().includes('am') || timeStr.toLowerCase().includes('pm')) {
    return timeStr;
  }
  const [hStr, mStr] = timeStr.split(':');
  let h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10) || 0;
  if (isNaN(h)) return timeStr;

  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  if (h === 0) h = 12;

  return `${h}:${m.toString().padStart(2, '0')} ${ampm}`;
}

/**
 * Calculates human duration between two "HH:mm" times
 * e.g. "07:00" and "08:30" -> "1h 30m", "11:45" and "13:00" -> "1h 15m"
 */
export function formatDuration(startTime: string, endTime: string): string {
  const startMin = timeToMinutes(startTime);
  let endMin = timeToMinutes(endTime);
  if (endMin < startMin) {
    endMin += 24 * 60; // Crosses midnight
  }
  const diff = endMin - startMin;
  const hours = Math.floor(diff / 60);
  const mins = diff % 60;

  if (hours > 0 && mins > 0) return `${hours}h ${mins}m`;
  if (hours > 0) return `${hours} hr${hours > 1 ? 's' : ''}`;
  return `${mins} mins`;
}

/**
 * Calculates percentage offset and width for a slot along a timeline line
 */
export function calculateSlotPosition(
  lineStartHour: string,
  lineEndHour: string,
  slotStartTime: string,
  slotEndTime: string
): { leftPercent: number; widthPercent: number } {
  const lineStart = timeToMinutes(lineStartHour);
  let lineEnd = timeToMinutes(lineEndHour);
  if (lineEnd <= lineStart) lineEnd += 24 * 60;

  const totalLineMinutes = lineEnd - lineStart;
  if (totalLineMinutes <= 0) return { leftPercent: 0, widthPercent: 10 };

  const slotStart = Math.max(lineStart, timeToMinutes(slotStartTime));
  let slotEnd = timeToMinutes(slotEndTime);
  if (slotEnd < slotStart) slotEnd += 24 * 60;
  slotEnd = Math.min(lineEnd, slotEnd);

  const leftMinutes = Math.max(0, slotStart - lineStart);
  const durationMinutes = Math.max(15, slotEnd - slotStart); // Minimum 15 min display width

  const leftPercent = Math.min(95, Math.max(0, (leftMinutes / totalLineMinutes) * 100));
  const widthPercent = Math.min(100 - leftPercent, Math.max(3, (durationMinutes / totalLineMinutes) * 100));

  return { leftPercent, widthPercent };
}

/**
 * Generate hourly tick marks for timeline line
 */
export function generateHourTicks(startHour: string, endHour: string): { time24: string; label: string; percent: number }[] {
  const lineStart = timeToMinutes(startHour);
  let lineEnd = timeToMinutes(endHour);
  if (lineEnd <= lineStart) lineEnd += 24 * 60;

  const total = lineEnd - lineStart;
  if (total <= 0) return [];

  const ticks: { time24: string; label: string; percent: number }[] = [];
  const startHourRounded = Math.ceil(lineStart / 60) * 60;

  for (let min = startHourRounded; min <= lineEnd; min += 60) {
    const percent = ((min - lineStart) / total) * 100;
    const time24 = minutesToTime(min);
    ticks.push({
      time24,
      label: formatTime12h(time24),
      percent,
    });
  }

  return ticks;
}
