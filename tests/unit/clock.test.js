import { describe, test, expect } from '@jest/globals';
import { getCurrentTime, getActiveWords, getActiveWordKeys } from '../../src/js/clock.js';
import { localeDe } from '../../src/locales/de.js';
import { localeEn } from '../../src/locales/en.js';

describe('getCurrentTime', () => {
  test('returns hours and minutes', () => {
    const time = getCurrentTime();
    expect(time).toHaveProperty('hours');
    expect(time).toHaveProperty('minutes');
    expect(time.hours).toBeGreaterThanOrEqual(0);
    expect(time.hours).toBeLessThan(24);
    expect(time.minutes).toBeGreaterThanOrEqual(0);
    expect(time.minutes).toBeLessThan(60);
  });
});

describe('getActiveWordKeys', () => {
  test('returns array of word keys for German locale', () => {
    const keys = getActiveWordKeys(12, 0, localeDe);
    expect(Array.isArray(keys)).toBe(true);
    expect(keys).toContain('ES');
    expect(keys).toContain('IST');
  });

  test('returns array of word keys for English locale', () => {
    const keys = getActiveWordKeys(12, 0, localeEn);
    expect(Array.isArray(keys)).toBe(true);
    expect(keys).toContain('IT');
    expect(keys).toContain('IS');
  });
});

describe('getActiveWords', () => {
  test('returns grid positions for German locale', () => {
    const positions = getActiveWords(12, 0, localeDe);
    expect(Array.isArray(positions)).toBe(true);
    for (const pos of positions) {
      expect(pos).toHaveProperty('row');
      expect(pos).toHaveProperty('col');
      expect(pos).toHaveProperty('length');
    }
  });
});
