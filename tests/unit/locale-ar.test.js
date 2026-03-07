import { describe, test, expect } from '@jest/globals';
import { localeAr } from '../../src/locales/ar.js';

const { GRID, WORDS, timeToWords } = localeAr;

describe('Arabic locale - grid structure', () => {
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
        expect(cell).toMatch(/^[A-Z]$/);
      }
    }
  });
});

describe('Arabic locale - word positions match grid', () => {
  test('each word maps to correct letters in grid', () => {
    const expected = {
      ESSA: 'ESSA', WA: 'WA', ILLA: 'ILLA',
      ITHNAN: 'ITHNAN', RUB: 'RUB',
      KHAMSA_H: 'KHAMSA', THALA: 'THALA',
      ARBA: 'ARBA', SITTA: 'SITTA',
      SABA: 'SABA', TISA: 'TISA',
      KHAMSA_M: 'KHAMSA', ASHRA_M: 'ASHRA',
      THAMAN: 'THAMAN', ASHRA_H: 'ASHRA',
      ISHRIN: 'ISHRIN', ITHNA: 'ITHNA',
      ASHR: 'ASHR', WAHID: 'WAHID',
      NISF: 'NISF', AHAD: 'AHAD',
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

describe('Arabic locale - timeToWords', () => {
  const cases = [
    { h: 12, m: 0,  expect: ['ESSA', 'ITHNA', 'ASHR'] },
    { h: 12, m: 5,  expect: ['ESSA', 'ITHNA', 'ASHR', 'WA', 'KHAMSA_M'] },
    { h: 12, m: 10, expect: ['ESSA', 'ITHNA', 'ASHR', 'WA', 'ASHRA_M'] },
    { h: 12, m: 15, expect: ['ESSA', 'ITHNA', 'ASHR', 'WA', 'RUB'] },
    { h: 12, m: 20, expect: ['ESSA', 'ITHNA', 'ASHR', 'WA', 'ISHRIN'] },
    { h: 12, m: 25, expect: ['ESSA', 'ITHNA', 'ASHR', 'WA', 'ISHRIN', 'KHAMSA_M'] },
    { h: 12, m: 30, expect: ['ESSA', 'ITHNA', 'ASHR', 'WA', 'NISF'] },
    { h: 12, m: 35, expect: ['ESSA', 'WAHID', 'ILLA', 'ISHRIN', 'KHAMSA_M'] },
    { h: 12, m: 40, expect: ['ESSA', 'WAHID', 'ILLA', 'ISHRIN'] },
    { h: 12, m: 45, expect: ['ESSA', 'WAHID', 'ILLA', 'RUB'] },
    { h: 12, m: 50, expect: ['ESSA', 'WAHID', 'ILLA', 'ASHRA_M'] },
    { h: 12, m: 55, expect: ['ESSA', 'WAHID', 'ILLA', 'KHAMSA_M'] },
    { h: 1,  m: 0,  expect: ['ESSA', 'WAHID'] },
    { h: 0,  m: 0,  expect: ['ESSA', 'ITHNA', 'ASHR'] },
  ];

  for (const { h, m, expect: expected } of cases) {
    test(`${h}:${String(m).padStart(2, '0')} -> ${expected.join(' ')}`, () => {
      const result = timeToWords(h, m);
      expect(result).toEqual(expected);
    });
  }

  test('floors to nearest 5 minutes (7:24 -> 7:20)', () => {
    const result = timeToWords(7, 24);
    expect(result).toEqual(['ESSA', 'SABA', 'WA', 'ISHRIN']);
  });

  test('all 5-minute intervals return valid word keys', () => {
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 5) {
        const result = timeToWords(h, m);
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBeGreaterThan(0);
        expect(result[0]).toBe('ESSA');
        for (const key of result) {
          expect(WORDS[key]).toBeDefined();
        }
      }
    }
  });
});
