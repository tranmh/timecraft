import { describe, test, expect } from '@jest/globals';
import { localeVi } from '../../src/locales/vi.js';

const { GRID, WORDS, timeToWords } = localeVi;

describe('Vietnamese locale - grid structure', () => {
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

describe('Vietnamese locale - word positions match grid', () => {
  test('each word maps to correct letters in grid', () => {
    const expected = {
      MUOI_H: 'M\u01AF\u1EDCI', MOT: 'M\u1ED8T', BON: 'B\u1ED0N',
      HAI_H: 'HAI', BA: 'BA', SAU: 'S\u00C1U', BAY: 'B\u1EA2Y',
      TAM: 'T\u00C1M', NAM_H: 'N\u0102M', CHIN: 'CH\u00CDN',
      GIO: 'GI\u1EDC', KEM: 'K\u00C9M', RUOI: 'R\u01AF\u1EE0I',
      MUOI_M: 'M\u01AF\u1EDCI', HAI_M: 'HAI', NAM_M: 'N\u0102M',
      MUOI_T: 'M\u01AF\u01A0I', LAM: 'L\u0102M',
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

describe('Vietnamese locale - timeToWords', () => {
  const cases = [
    { h: 3, m: 0,  expect: ['BA', 'GIO'] },
    { h: 3, m: 5,  expect: ['BA', 'GIO', 'NAM_M'] },
    { h: 3, m: 10, expect: ['BA', 'GIO', 'MUOI_M'] },
    { h: 3, m: 15, expect: ['BA', 'GIO', 'MUOI_M', 'LAM'] },
    { h: 3, m: 20, expect: ['BA', 'GIO', 'HAI_M', 'MUOI_T'] },
    { h: 3, m: 25, expect: ['BA', 'GIO', 'HAI_M', 'MUOI_T', 'LAM'] },
    { h: 3, m: 30, expect: ['BA', 'GIO', 'RUOI'] },
    { h: 3, m: 35, expect: ['BON', 'GIO', 'KEM', 'HAI_M', 'MUOI_T', 'LAM'] },
    { h: 3, m: 40, expect: ['BON', 'GIO', 'KEM', 'HAI_M', 'MUOI_T'] },
    { h: 3, m: 45, expect: ['BON', 'GIO', 'KEM', 'MUOI_M', 'LAM'] },
    { h: 3, m: 50, expect: ['BON', 'GIO', 'KEM', 'MUOI_M'] },
    { h: 3, m: 55, expect: ['BON', 'GIO', 'KEM', 'NAM_M'] },
    { h: 12, m: 0, expect: ['MUOI_H', 'HAI_H', 'GIO'] },
    { h: 11, m: 0, expect: ['MUOI_H', 'MOT', 'GIO'] },
    { h: 0,  m: 0, expect: ['MUOI_H', 'HAI_H', 'GIO'] },
  ];

  for (const { h, m, expect: expected } of cases) {
    test(`${h}:${String(m).padStart(2, '0')} -> ${expected.join(' ')}`, () => {
      const result = timeToWords(h, m);
      expect(result).toEqual(expected);
    });
  }

  test('floors to nearest 5 minutes (7:24 -> 7:20)', () => {
    const result = timeToWords(7, 24);
    expect(result).toEqual(['BAY', 'GIO', 'HAI_M', 'MUOI_T']);
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

  test('word keys are in top-to-bottom left-to-right reading order for all times', () => {
    const issues = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 5) {
        const keys = timeToWords(h, m);
        for (let i = 1; i < keys.length; i++) {
          const prev = WORDS[keys[i - 1]];
          const curr = WORDS[keys[i]];
          const prevEnd = prev.col + prev.length - 1;
          if (curr.row < prev.row || (curr.row === prev.row && curr.col <= prevEnd && curr.col < prev.col)) {
            issues.push(`${h}:${String(m).padStart(2, '0')} - "${keys[i]}" (row ${curr.row}) appears before "${keys[i - 1]}" (row ${prev.row}) in grid`);
          }
        }
      }
    }
    expect(issues).toEqual([]);
  });
});
