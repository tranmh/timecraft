import { describe, test, expect } from '@jest/globals';
import { localeRu } from '../../src/locales/ru.js';

const { GRID, WORDS, timeToWords } = localeRu;

describe('Russian locale - grid structure', () => {
  test('grid has 10 rows', () => {
    expect(GRID.length).toBe(10);
  });

  test('each row has 11 columns', () => {
    for (const row of GRID) {
      expect(row.length).toBe(11);
    }
  });

  test('all cells are single uppercase Cyrillic letters', () => {
    for (const row of GRID) {
      for (const cell of row) {
        expect(cell).toMatch(/^[А-ЯЁ]$/);
      }
    }
  });
});

describe('Russian locale - word positions match grid', () => {
  test('each word maps to correct letters in grid', () => {
    const expected = {
      CHETVERT: 'ЧЕТВЕРТЬ', BEZ: 'БЕЗ', POLOVINA: 'ПОЛОВИНА', CHAS: 'ЧАС',
      DVADCAT: 'ДВАДЦАТЬ', DVA: 'ДВА', DESYAT_M: 'ДЕСЯТЬ', PYAT_M: 'ПЯТЬ',
      DESYAT_H: 'ДЕСЯТЬ', SEM: 'СЕМЬ', ODINNADCAT: 'ОДИННАДЦАТЬ', ODIN: 'ОДИН',
      DVENADCAT: 'ДВЕНАДЦАТЬ', CHETYRE: 'ЧЕТЫРЕ', PYAT_H: 'ПЯТЬ',
      VOSEM: 'ВОСЕМЬ', SHEST: 'ШЕСТЬ', DEVYAT: 'ДЕВЯТЬ', TRI: 'ТРИ',
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

describe('Russian locale - timeToWords', () => {
  const cases = [
    { h: 12, m: 0,  expect: ['CHAS', 'DVENADCAT'] },
    { h: 12, m: 5,  expect: ['PYAT_M', 'DVENADCAT'] },
    { h: 12, m: 10, expect: ['DESYAT_M', 'DVENADCAT'] },
    { h: 12, m: 15, expect: ['CHETVERT', 'DVENADCAT'] },
    { h: 12, m: 20, expect: ['DVADCAT', 'DVENADCAT'] },
    { h: 12, m: 25, expect: ['DVADCAT', 'PYAT_M', 'DVENADCAT'] },
    { h: 12, m: 30, expect: ['POLOVINA', 'DVENADCAT'] },
    { h: 12, m: 35, expect: ['BEZ', 'DVADCAT', 'PYAT_M', 'ODIN'] },
    { h: 12, m: 40, expect: ['BEZ', 'DVADCAT', 'ODIN'] },
    { h: 12, m: 45, expect: ['BEZ', 'CHETVERT', 'ODIN'] },
    { h: 12, m: 50, expect: ['BEZ', 'DESYAT_M', 'ODIN'] },
    { h: 12, m: 55, expect: ['BEZ', 'PYAT_M', 'ODIN'] },
    { h: 1,  m: 0,  expect: ['CHAS', 'ODIN'] },
    { h: 0,  m: 0,  expect: ['CHAS', 'DVENADCAT'] },
  ];

  for (const { h, m, expect: expected } of cases) {
    test(`${h}:${String(m).padStart(2, '0')} -> ${expected.join(' ')}`, () => {
      const result = timeToWords(h, m);
      expect(result).toEqual(expected);
    });
  }

  test('floors to nearest 5 minutes (7:24 -> 7:20)', () => {
    const result = timeToWords(7, 24);
    expect(result).toEqual(['DVADCAT', 'SEM']);
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
