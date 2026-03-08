import { describe, test, expect } from '@jest/globals';
import { localeAt } from '../../src/locales/at.js';

const { GRID, WORDS, timeToWords } = localeAt;

describe('Austrian locale - grid structure', () => {
  test('grid has 10 rows', () => {
    expect(GRID.length).toBe(10);
  });

  test('each row has 11 columns', () => {
    for (const row of GRID) {
      expect(row.length).toBe(11);
    }
  });

  test('all cells are single uppercase letters', () => {
    for (const row of GRID) {
      for (const cell of row) {
        expect(cell).toMatch(/^[A-ZÄÖÜß]$/);
      }
    }
  });
});

describe('Austrian locale - word positions match grid', () => {
  test('each word maps to correct letters in grid', () => {
    const expected = {
      ES: 'ES', IST: 'IST', FUNF_M: 'FÜNF', ZEHN_M: 'ZEHN',
      ZWANZIG: 'ZWANZIG', DREIVIERTEL: 'DREIVIERTEL', VIERTEL: 'VIERTEL',
      NACH: 'NACH', VOR: 'VOR',
      HALB: 'HALB', ZWOLF: 'ZWÖLF', ZWEI: 'ZWEI', EIN: 'EIN', EINS: 'EINS',
      SIEBEN: 'SIEBEN', DREI_H: 'DREI', FUNF_H: 'FÜNF', ELF: 'ELF',
      NEUN: 'NEUN', VIER: 'VIER', ACHT: 'ACHT', ZEHN_H: 'ZEHN',
      SECHS: 'SECHS', UHR: 'UHR',
    };

    for (const [key, text] of Object.entries(expected)) {
      const word = WORDS[key];
      expect(word).toBeDefined();
      let actual = '';
      for (let i = 0; i < word.length; i++) {
        actual += GRID[word.row][word.col + i];
      }
      expect(actual).toBe(text);
    }
  });
});

describe('Austrian locale - timeToWords', () => {
  const cases = [
    // Austrian uses "VIERTEL [next hour]" at :15 and "DREIVIERTEL [next hour]" at :45
    { h: 12, m: 0,  expect: ['ES', 'IST', 'ZWOLF', 'UHR'] },
    { h: 12, m: 5,  expect: ['ES', 'IST', 'FUNF_M', 'NACH', 'ZWOLF'] },
    { h: 12, m: 10, expect: ['ES', 'IST', 'ZEHN_M', 'NACH', 'ZWOLF'] },
    { h: 12, m: 15, expect: ['ES', 'IST', 'VIERTEL', 'EINS'] },
    { h: 12, m: 20, expect: ['ES', 'IST', 'ZWANZIG', 'NACH', 'ZWOLF'] },
    { h: 12, m: 25, expect: ['ES', 'IST', 'FUNF_M', 'VOR', 'HALB', 'EINS'] },
    { h: 12, m: 30, expect: ['ES', 'IST', 'HALB', 'EINS'] },
    { h: 12, m: 35, expect: ['ES', 'IST', 'FUNF_M', 'NACH', 'HALB', 'EINS'] },
    { h: 12, m: 40, expect: ['ES', 'IST', 'ZWANZIG', 'VOR', 'EINS'] },
    { h: 12, m: 45, expect: ['ES', 'IST', 'DREIVIERTEL', 'EINS'] },
    { h: 12, m: 50, expect: ['ES', 'IST', 'ZEHN_M', 'VOR', 'EINS'] },
    { h: 12, m: 55, expect: ['ES', 'IST', 'FUNF_M', 'VOR', 'EINS'] },
    { h: 1,  m: 0,  expect: ['ES', 'IST', 'EIN', 'UHR'] },
    { h: 0,  m: 0,  expect: ['ES', 'IST', 'ZWOLF', 'UHR'] },
    { h: 23, m: 55, expect: ['ES', 'IST', 'FUNF_M', 'VOR', 'ZWOLF'] },
    // Verify :15 and :45 at different hours
    { h: 3,  m: 15, expect: ['ES', 'IST', 'VIERTEL', 'VIER'] },
    { h: 3,  m: 45, expect: ['ES', 'IST', 'DREIVIERTEL', 'VIER'] },
    { h: 11, m: 15, expect: ['ES', 'IST', 'VIERTEL', 'ZWOLF'] },
    { h: 11, m: 45, expect: ['ES', 'IST', 'DREIVIERTEL', 'ZWOLF'] },
  ];

  for (const { h, m, expect: expected } of cases) {
    test(`${h}:${String(m).padStart(2, '0')} -> ${expected.join(' ')}`, () => {
      const result = timeToWords(h, m);
      expect(result).toEqual(expected);
    });
  }

  test('floors to nearest 5 minutes (7:24 -> 7:20)', () => {
    const result = timeToWords(7, 24);
    expect(result).toEqual(['ES', 'IST', 'ZWANZIG', 'NACH', 'SIEBEN']);
  });

  test('floors not rounds (7:28 -> 7:25, not 7:30)', () => {
    const result = timeToWords(7, 28);
    expect(result).toEqual(['ES', 'IST', 'FUNF_M', 'VOR', 'HALB', 'ACHT']);
  });

  test('all 5-minute intervals return valid word keys', () => {
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 5) {
        const result = timeToWords(h, m);
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBeGreaterThan(0);
        expect(result[0]).toBe('ES');
        expect(result[1]).toBe('IST');
        for (const key of result) {
          expect(WORDS[key]).toBeDefined();
        }
      }
    }
  });
});
