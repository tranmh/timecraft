import { describe, test, expect } from '@jest/globals';
import { localeHi } from '../../src/locales/hi.js';

const { GRID, WORDS, timeToWords } = localeHi;

describe('Hindi locale - grid structure', () => {
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

describe('Hindi locale - word positions match grid', () => {
  test('each word maps to correct letters in grid', () => {
    const expected = {
      ABHI: 'ABHI', BAJE: 'BAJE', KAM: 'KAM',
      GYARA: 'GYARA', BARA: 'BARA', PANCH_H: 'PANCH', DAS_H: 'DAS',
      TIN: 'TIN', CHAR: 'CHAR', EK: 'EK', DO: 'DO',
      SAT: 'SAT', NAU: 'NAU', ATH: 'ATH', CHE: 'CHE',
      SAV: 'SAV', ADHA: 'ADHA', PANCH_M: 'PANCH', DAS_M: 'DAS',
      BIS_M: 'BIS',
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

describe('Hindi locale - timeToWords', () => {
  const cases = [
    { h: 12, m: 0,  expect: ['ABHI', 'BARA', 'BAJE'] },
    { h: 12, m: 5,  expect: ['ABHI', 'BARA', 'PANCH_M'] },
    { h: 12, m: 10, expect: ['ABHI', 'BARA', 'DAS_M'] },
    { h: 12, m: 15, expect: ['ABHI', 'BARA', 'SAV'] },
    { h: 12, m: 20, expect: ['ABHI', 'BARA', 'BIS_M'] },
    { h: 12, m: 25, expect: ['ABHI', 'BARA', 'BIS_M', 'PANCH_M'] },
    { h: 12, m: 30, expect: ['ABHI', 'BARA', 'ADHA'] },
    { h: 12, m: 35, expect: ['ABHI', 'EK', 'KAM', 'BIS_M', 'PANCH_M'] },
    { h: 12, m: 40, expect: ['ABHI', 'EK', 'KAM', 'BIS_M'] },
    { h: 12, m: 45, expect: ['ABHI', 'EK', 'KAM', 'SAV'] },
    { h: 12, m: 50, expect: ['ABHI', 'EK', 'KAM', 'DAS_M'] },
    { h: 12, m: 55, expect: ['ABHI', 'EK', 'KAM', 'PANCH_M'] },
    { h: 1,  m: 0,  expect: ['ABHI', 'EK', 'BAJE'] },
    { h: 0,  m: 0,  expect: ['ABHI', 'BARA', 'BAJE'] },
  ];

  for (const { h, m, expect: expected } of cases) {
    test(`${h}:${String(m).padStart(2, '0')} -> ${expected.join(' ')}`, () => {
      const result = timeToWords(h, m);
      expect(result).toEqual(expected);
    });
  }

  test('floors to nearest 5 minutes (7:24 -> 7:20)', () => {
    const result = timeToWords(7, 24);
    expect(result).toEqual(['ABHI', 'SAT', 'BIS_M']);
  });

  test('all 5-minute intervals return valid word keys', () => {
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 5) {
        const result = timeToWords(h, m);
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBeGreaterThan(0);
        expect(result[0]).toBe('ABHI');
        for (const key of result) {
          expect(WORDS[key]).toBeDefined();
        }
      }
    }
  });
});
