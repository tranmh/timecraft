import { describe, test, expect } from '@jest/globals';
import { localeZh } from '../../src/locales/zh.js';

const { GRID, WORDS, timeToWords } = localeZh;

describe('Chinese locale - grid structure', () => {
  test('grid has 10 rows', () => {
    expect(GRID.length).toBe(10);
  });

  test('each row has 11 columns', () => {
    for (const row of GRID) {
      expect(row.length).toBe(11);
    }
  });

  test('all cells are single Chinese characters', () => {
    for (const row of GRID) {
      for (const cell of row) {
        expect(cell).toMatch(/^[\u4e00-\u9fff]$/);
      }
    }
  });
});

describe('Chinese locale - word positions match grid', () => {
  test('each word maps to correct characters in grid', () => {
    const expected = {
      XIANZAI: '现在', DIAN: '点', ZHENG: '整', BAN: '半', FEN: '分',
      YI: '一', ER_H: '二', SAN_H: '三', SI_H: '四', WU_H: '五',
      LIU: '六', QI: '七', BA: '八', JIU: '九',
      SHI_H: '十', SHIYI: '十一', SHIER: '十二',
      ER_M: '二', SAN_M: '三', SI_M: '四', WU_M1: '五', SHI_M: '十',
      WU_M2: '五',
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

describe('Chinese locale - timeToWords', () => {
  const cases = [
    { h: 12, m: 0,  expect: ['XIANZAI', 'SHIER', 'DIAN', 'ZHENG'] },
    { h: 12, m: 5,  expect: ['XIANZAI', 'SHIER', 'DIAN', 'WU_M1', 'FEN'] },
    { h: 12, m: 10, expect: ['XIANZAI', 'SHIER', 'DIAN', 'SHI_M', 'FEN'] },
    { h: 12, m: 15, expect: ['XIANZAI', 'SHIER', 'DIAN', 'SHI_M', 'WU_M1', 'FEN'] },
    { h: 12, m: 20, expect: ['XIANZAI', 'SHIER', 'DIAN', 'ER_M', 'SHI_M', 'FEN'] },
    { h: 12, m: 25, expect: ['XIANZAI', 'SHIER', 'DIAN', 'ER_M', 'SHI_M', 'WU_M1', 'FEN'] },
    { h: 12, m: 30, expect: ['XIANZAI', 'SHIER', 'DIAN', 'BAN'] },
    { h: 12, m: 35, expect: ['XIANZAI', 'SHIER', 'DIAN', 'SAN_M', 'SHI_M', 'WU_M1', 'FEN'] },
    { h: 12, m: 40, expect: ['XIANZAI', 'SHIER', 'DIAN', 'SI_M', 'SHI_M', 'FEN'] },
    { h: 12, m: 45, expect: ['XIANZAI', 'SHIER', 'DIAN', 'SI_M', 'SHI_M', 'WU_M1', 'FEN'] },
    { h: 12, m: 50, expect: ['XIANZAI', 'SHIER', 'DIAN', 'WU_M2', 'SHI_M', 'FEN'] },
    { h: 12, m: 55, expect: ['XIANZAI', 'SHIER', 'DIAN', 'WU_M2', 'SHI_M', 'WU_M1', 'FEN'] },
    { h: 1,  m: 0,  expect: ['XIANZAI', 'YI', 'DIAN', 'ZHENG'] },
    { h: 0,  m: 0,  expect: ['XIANZAI', 'SHIER', 'DIAN', 'ZHENG'] },
  ];

  for (const { h, m, expect: expected } of cases) {
    test(`${h}:${String(m).padStart(2, '0')} -> ${expected.join(' ')}`, () => {
      const result = timeToWords(h, m);
      expect(result).toEqual(expected);
    });
  }

  test('floors to nearest 5 minutes (7:24 -> 7:20)', () => {
    const result = timeToWords(7, 24);
    expect(result).toEqual(['XIANZAI', 'QI', 'DIAN', 'ER_M', 'SHI_M', 'FEN']);
  });

  test('all 5-minute intervals return valid word keys', () => {
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 5) {
        const result = timeToWords(h, m);
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBeGreaterThan(0);
        expect(result[0]).toBe('XIANZAI');
        for (const key of result) {
          expect(WORDS[key]).toBeDefined();
        }
      }
    }
  });
});
