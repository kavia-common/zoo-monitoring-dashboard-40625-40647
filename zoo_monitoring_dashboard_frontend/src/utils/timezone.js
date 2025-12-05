const DEFAULT_TZ = 'America/Chicago'; // sensible default if ZOO timezone not set

/**
 * PUBLIC_INTERFACE
 * getZooTimeZone
 * Returns the configured Zoo time zone string from environment or default.
 */
export function getZooTimeZone() {
  // REACT_APP_ZOO_TIMEZONE can be supplied via environment; otherwise fallback.
  const tz = process.env.REACT_APP_ZOO_TIMEZONE || DEFAULT_TZ;
  return tz;
}

/**
 * PUBLIC_INTERFACE
 * formatInZooTz
 * Formats a given Date|number|string to readable string in the Zoo Time Zone.
 * @param {Date|number|string} input - Date object or timestamp/ISO string
 * @param {Intl.DateTimeFormatOptions} options - formatter options
 * @returns {string}
 */
export function formatInZooTz(input, options = {}) {
  try {
    const tz = getZooTimeZone();
    const date = input instanceof Date ? input : new Date(input);
    const fmt = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      ...options,
    });
    return fmt.format(date);
  } catch {
    // As a last resort, return ISO string truncated
    const d = input instanceof Date ? input : new Date(input);
    return d.toISOString();
  }
}

/**
 * PUBLIC_INTERFACE
 * formatTimeOnlyInZooTz
 * Formats only time component in Zoo TZ, e.g., 08:00 PM.
 */
export function formatTimeOnlyInZooTz(input, options = {}) {
  const tz = getZooTimeZone();
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    ...options,
  });
  const d = input instanceof Date ? input : new Date(input);
  return fmt.format(d);
}
