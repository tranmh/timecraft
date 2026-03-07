import { describe, test, expect } from '@jest/globals';
import { localeIt } from '../../src/locales/it.js';

const { GRID, WORDS, timeToWords } = localeIt;

describe('Italian locale - grid structure', () => {
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

describe('Italian locale - word positions match grid', () => {
  test('each word maps to correct letters in grid', () => {
    const expected = {
      SONO: 'SONO', LE: 'LE', DUE: 'DUE',
      E_VERB: 'E', L: 'L', UNA: 'UNA', TRE: 'TRE',
      QUATTRO: 'QUATTRO', SEI: 'SEI',
      CINQUE_H: 'CINQUE', OTTO: 'OTTO',
      NOVE: 'NOVE', SETTE: 'SETTE',
      DIECI_H: 'DIECI', UNDICI: 'UNDICI',
      DODICI: 'DODICI', MENO: 'MENO',
      E_CONJ: 'E', QUARTO: 'QUARTO',
      VENTI: 'VENTI', DIECI_M: 'DIECI',
      MEZZA: 'MEZZA', CINQUE_M: 'CINQUE',
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

describe('Italian locale - timeToWords', () => {
  const cases = [
    { h: 12, m: 0,  expect: ['SONO', 'LE', 'DODICI'] },
    { h: 12, m: 5,  expect: ['SONO', 'LE', 'DODICI', 'E_CONJ', 'CINQUE_M'] },
    { h: 12, m: 10, expect: ['SONO', 'LE', 'DODICI', 'E_CONJ', 'DIECI_M'] },
    { h: 12, m: 15, expect: ['SONO', 'LE', 'DODICI', 'E_CONJ', 'QUARTO'] },
    { h: 12, m: 20, expect: ['SONO', 'LE', 'DODICI', 'E_CONJ', 'VENTI'] },
    { h: 12, m: 25, expect: ['SONO', 'LE', 'DODICI', 'E_CONJ', 'VENTI', 'CINQUE_M'] },
    { h: 12, m: 30, expect: ['SONO', 'LE', 'DODICI', 'E_CONJ', 'MEZZA'] },
    { h: 12, m: 35, expect: ['E_VERB', 'L', 'UNA', 'MENO', 'VENTI', 'CINQUE_M'] },
    { h: 12, m: 40, expect: ['E_VERB', 'L', 'UNA', 'MENO', 'VENTI'] },
    { h: 12, m: 45, expect: ['E_VERB', 'L', 'UNA', 'MENO', 'QUARTO'] },
    { h: 12, m: 50, expect: ['E_VERB', 'L', 'UNA', 'MENO', 'DIECI_M'] },
    { h: 12, m: 55, expect: ['E_VERB', 'L', 'UNA', 'MENO', 'CINQUE_M'] },
    { h: 1,  m: 0,  expect: ['E_VERB', 'L', 'UNA'] },
    { h: 0,  m: 0,  expect: ['SONO', 'LE', 'DODICI'] },
  ];

  for (const { h, m, expect: expected } of cases) {
    test(`${h}:${String(m).padStart(2, '0')} -> ${expected.join(' ')}`, () => {
      const result = timeToWords(h, m);
      expect(result).toEqual(expected);
    });
  }

  test('floors to nearest 5 minutes (7:24 -> 7:20)', () => {
    const result = timeToWords(7, 24);
    expect(result).toEqual(['SONO', 'LE', 'SETTE', 'E_CONJ', 'VENTI']);
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
