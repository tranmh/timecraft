/**
 * Core time logic for the word clock.
 */

export function getCurrentTime() {
  const now = new Date();
  return { hours: now.getHours(), minutes: now.getMinutes() };
}

export function getActiveWords(hours, minutes, locale) {
  const wordKeys = locale.timeToWords(hours, minutes);
  return wordKeys.map(key => locale.WORDS[key]).filter(Boolean);
}

export function getActiveWordKeys(hours, minutes, locale) {
  return locale.timeToWords(hours, minutes);
}
