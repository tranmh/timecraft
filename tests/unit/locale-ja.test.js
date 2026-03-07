import { describe, test, expect } from '@jest/globals';
import { localeJa } from '../../src/locales/ja.js';

const { GRID, WORDS, timeToWords } = localeJa;

describe('Japanese locale - grid structure', () => {
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

describe('Japanese locale - word positions match grid', () => {
  test('each word maps to correct characters in grid', () => {
    const expected = {
      IMA: '今', JI: '時', CHOUDO: '丁度', FUN: '分', HAN: '半',
      ICHI: '一', NI_H: '二', SAN_H: '三', YON: '四',
      GO_H: '五', ROKU: '六', NANA: '七', HACHI: '八', KU: '九',
      JUU_H: '十', JUUICHI: '十一', JUUNI: '十二',
      NI_M: '二', SAN_M: '三', YON_M: '四', GO_M1: '五', JUU_M: '十',
      GO_M2: '五',
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

describe('Japanese locale - timeToWords', () => {
  const cases = [
    { h: 12, m: 0,  expect: ['IMA', 'JUUNI', 'JI', 'CHOUDO'] },
    { h: 12, m: 5,  expect: ['IMA', 'JUUNI', 'JI', 'GO_M1', 'FUN'] },
    { h: 12, m: 10, expect: ['IMA', 'JUUNI', 'JI', 'JUU_M', 'FUN'] },
    { h: 12, m: 15, expect: ['IMA', 'JUUNI', 'JI', 'JUU_M', 'GO_M1', 'FUN'] },
    { h: 12, m: 20, expect: ['IMA', 'JUUNI', 'JI', 'NI_M', 'JUU_M', 'FUN'] },
    { h: 12, m: 25, expect: ['IMA', 'JUUNI', 'JI', 'NI_M', 'JUU_M', 'GO_M1', 'FUN'] },
    { h: 12, m: 30, expect: ['IMA', 'JUUNI', 'JI', 'HAN'] },
    { h: 12, m: 35, expect: ['IMA', 'JUUNI', 'JI', 'SAN_M', 'JUU_M', 'GO_M1', 'FUN'] },
    { h: 12, m: 40, expect: ['IMA', 'JUUNI', 'JI', 'YON_M', 'JUU_M', 'FUN'] },
    { h: 12, m: 45, expect: ['IMA', 'JUUNI', 'JI', 'YON_M', 'JUU_M', 'GO_M1', 'FUN'] },
    { h: 12, m: 50, expect: ['IMA', 'JUUNI', 'JI', 'GO_M2', 'JUU_M', 'FUN'] },
    { h: 12, m: 55, expect: ['IMA', 'JUUNI', 'JI', 'GO_M2', 'JUU_M', 'GO_M1', 'FUN'] },
    { h: 1,  m: 0,  expect: ['IMA', 'ICHI', 'JI', 'CHOUDO'] },
    { h: 0,  m: 0,  expect: ['IMA', 'JUUNI', 'JI', 'CHOUDO'] },
  ];

  for (const { h, m, expect: expected } of cases) {
    test(`${h}:${String(m).padStart(2, '0')} -> ${expected.join(' ')}`, () => {
      const result = timeToWords(h, m);
      expect(result).toEqual(expected);
    });
  }

  test('floors to nearest 5 minutes (7:24 -> 7:20)', () => {
    const result = timeToWords(7, 24);
    expect(result).toEqual(['IMA', 'NANA', 'JI', 'NI_M', 'JUU_M', 'FUN']);
  });

  test('all 5-minute intervals return valid word keys', () => {
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 5) {
        const result = timeToWords(h, m);
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBeGreaterThan(0);
        expect(result[0]).toBe('IMA');
        for (const key of result) {
          expect(WORDS[key]).toBeDefined();
        }
      }
    }
  });
});
