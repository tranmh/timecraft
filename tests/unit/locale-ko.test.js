import { describe, test, expect } from '@jest/globals';
import { localeKo } from '../../src/locales/ko.js';

const { GRID, WORDS, timeToWords } = localeKo;

describe('Korean locale - grid structure', () => {
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

describe('Korean locale - word positions match grid', () => {
  test('each word maps to correct characters in grid', () => {
    const expected = {
      JIGEUM: '지금', JEONGGAK: '정각', SI: '시', BUN: '분', BAN: '반',
      HAN: '한', DU: '두', SE: '세', NE: '네', YEOL: '열',
      DASEOT: '다섯', YEOSEOT: '여섯', ILGOP: '일곱', YEODEOL: '여덟', AHOP: '아홉',
      YEOLHAN: '열한', YEOLDU: '열두',
      I_M: '이', SAM_M: '삼', SA_M: '사', O_M1: '오', SIP_M: '십', O_M2: '오',
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

describe('Korean locale - timeToWords', () => {
  const cases = [
    { h: 12, m: 0,  expect: ['JIGEUM', 'YEOLDU', 'SI', 'JEONGGAK'] },
    { h: 12, m: 5,  expect: ['JIGEUM', 'YEOLDU', 'SI', 'O_M1', 'BUN'] },
    { h: 12, m: 10, expect: ['JIGEUM', 'YEOLDU', 'SI', 'SIP_M', 'BUN'] },
    { h: 12, m: 15, expect: ['JIGEUM', 'YEOLDU', 'SI', 'SIP_M', 'O_M1', 'BUN'] },
    { h: 12, m: 20, expect: ['JIGEUM', 'YEOLDU', 'SI', 'I_M', 'SIP_M', 'BUN'] },
    { h: 12, m: 25, expect: ['JIGEUM', 'YEOLDU', 'SI', 'I_M', 'SIP_M', 'O_M1', 'BUN'] },
    { h: 12, m: 30, expect: ['JIGEUM', 'YEOLDU', 'SI', 'BAN'] },
    { h: 12, m: 35, expect: ['JIGEUM', 'YEOLDU', 'SI', 'SAM_M', 'SIP_M', 'O_M1', 'BUN'] },
    { h: 12, m: 40, expect: ['JIGEUM', 'YEOLDU', 'SI', 'SA_M', 'SIP_M', 'BUN'] },
    { h: 12, m: 45, expect: ['JIGEUM', 'YEOLDU', 'SI', 'SA_M', 'SIP_M', 'O_M1', 'BUN'] },
    { h: 12, m: 50, expect: ['JIGEUM', 'YEOLDU', 'SI', 'O_M2', 'SIP_M', 'BUN'] },
    { h: 12, m: 55, expect: ['JIGEUM', 'YEOLDU', 'SI', 'O_M2', 'SIP_M', 'O_M1', 'BUN'] },
    { h: 1,  m: 0,  expect: ['JIGEUM', 'HAN', 'SI', 'JEONGGAK'] },
    { h: 0,  m: 0,  expect: ['JIGEUM', 'YEOLDU', 'SI', 'JEONGGAK'] },
  ];

  for (const { h, m, expect: expected } of cases) {
    test(`${h}:${String(m).padStart(2, '0')} -> ${expected.join(' ')}`, () => {
      const result = timeToWords(h, m);
      expect(result).toEqual(expected);
    });
  }

  test('floors to nearest 5 minutes (7:24 -> 7:20)', () => {
    const result = timeToWords(7, 24);
    expect(result).toEqual(['JIGEUM', 'ILGOP', 'SI', 'I_M', 'SIP_M', 'BUN']);
  });

  test('all 5-minute intervals return valid word keys', () => {
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 5) {
        const result = timeToWords(h, m);
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBeGreaterThan(0);
        expect(result[0]).toBe('JIGEUM');
        for (const key of result) {
          expect(WORDS[key]).toBeDefined();
        }
      }
    }
  });
});
