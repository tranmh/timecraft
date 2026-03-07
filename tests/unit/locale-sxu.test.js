import { describe, test, expect } from '@jest/globals';
import { localeSxu } from '../../src/locales/sxu.js';

const { GRID, WORDS, timeToWords } = localeSxu;

describe('Saxon locale - grid structure', () => {
  test('grid has 10 rows', () => {
    expect(GRID.length).toBe(10);
  });

  test('each row has 11 columns', () => {
    for (const row of GRID) {
      expect(row.length).toBe(11);
    }
  });

  test('all cells are single characters', () => {
    for (const row of GRID) {
      for (const cell of row) {
        expect(cell.length).toBe(1);
      }
    }
  });
});

describe('Saxon locale - word positions match grid', () => {
  test('each word maps to correct letters in grid', () => {
    const expected = {
      ES: 'ES', IS: 'IS', FUMF_M: 'F\u00DCMF',
      ZEHN_M: 'ZEHN', ZWANZG: 'ZWANZG',
      DREIVIERDL: 'DREIVIERDL', VIERDL: 'VIERDL', DREI_H: 'DREI',
      NACH: 'NACH', VOR: 'VOR', UHR: 'UHR', HALBE: 'HALBE',
      ZWOLFE: 'ZW\u00D6LFE', EENS: 'EENS', ZWEE: 'ZWEE', ELFE: 'ELFE',
      SECHSE: 'SECHSE', FUMFE: 'F\u00DCMFE', SIEBNE: 'SIEBNE',
      ACHDE: 'ACHDE', NEUNE: 'NEUNE', VIERE: 'VIERE', ZEHNE: 'ZEHNE',
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

describe('Saxon locale - timeToWords', () => {
  const cases = [
    { h: 3, m: 0,  expect: ['ES', 'IS', 'DREI_H', 'UHR'] },
    { h: 3, m: 5,  expect: ['ES', 'IS', 'FUMF_M', 'NACH', 'DREI_H'] },
    { h: 3, m: 10, expect: ['ES', 'IS', 'ZEHN_M', 'NACH', 'DREI_H'] },
    { h: 3, m: 15, expect: ['ES', 'IS', 'VIERDL', 'VIERE'] },
    { h: 3, m: 20, expect: ['ES', 'IS', 'ZEHN_M', 'VOR', 'HALBE', 'VIERE'] },
    { h: 3, m: 25, expect: ['ES', 'IS', 'FUMF_M', 'VOR', 'HALBE', 'VIERE'] },
    { h: 3, m: 30, expect: ['ES', 'IS', 'HALBE', 'VIERE'] },
    { h: 3, m: 35, expect: ['ES', 'IS', 'FUMF_M', 'NACH', 'HALBE', 'VIERE'] },
    { h: 3, m: 40, expect: ['ES', 'IS', 'ZWANZG', 'VOR', 'VIERE'] },
    { h: 3, m: 45, expect: ['ES', 'IS', 'DREIVIERDL', 'VIERE'] },
    { h: 3, m: 50, expect: ['ES', 'IS', 'ZEHN_M', 'VOR', 'VIERE'] },
    { h: 3, m: 55, expect: ['ES', 'IS', 'FUMF_M', 'VOR', 'VIERE'] },
    { h: 0, m: 0,  expect: ['ES', 'IS', 'ZWOLFE', 'UHR'] },
  ];

  for (const { h, m, expect: expected } of cases) {
    test(`${h}:${String(m).padStart(2, '0')} -> ${expected.join(' ')}`, () => {
      const result = timeToWords(h, m);
      expect(result).toEqual(expected);
    });
  }

  test('floors to nearest 5 minutes (7:24 -> 7:20)', () => {
    const result = timeToWords(7, 24);
    expect(result).toEqual(['ES', 'IS', 'ZEHN_M', 'VOR', 'HALBE', 'ACHDE']);
  });

  test('all 5-minute intervals return valid word keys', () => {
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 5) {
        const result = timeToWords(h, m);
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBeGreaterThan(0);
        for (const key of result) {
          expect(WORDS[key]).toBeDefined();
        }
      }
    }
  });
});
