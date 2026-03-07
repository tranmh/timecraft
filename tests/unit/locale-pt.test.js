import { describe, test, expect } from '@jest/globals';
import { localePt } from '../../src/locales/pt.js';

const { GRID, WORDS, timeToWords } = localePt;

describe('Portuguese locale - grid structure', () => {
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

describe('Portuguese locale - word positions match grid', () => {
  test('each word maps to correct letters in grid', () => {
    const expected = {
      E_VERB: 'E', SAO: 'SAO', DUAS: 'DUAS',
      UMA: 'UMA', DOZE: 'DOZE', ONZE: 'ONZE',
      QUATRO: 'QUATRO', CINCO_H: 'CINCO',
      SEIS: 'SEIS', SETE: 'SETE',
      OITO: 'OITO', NOVE: 'NOVE',
      TRES: 'TRES', DEZ_H: 'DEZ',
      E_CONJ: 'E', MENOS: 'MENOS', VINTE: 'VINTE',
      CINCO_M: 'CINCO', DEZ_M: 'DEZ',
      QUARTO: 'QUARTO', MEIA: 'MEIA',
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

describe('Portuguese locale - timeToWords', () => {
  const cases = [
    { h: 12, m: 0,  expect: ['SAO', 'DOZE'] },
    { h: 12, m: 5,  expect: ['SAO', 'DOZE', 'E_CONJ', 'CINCO_M'] },
    { h: 12, m: 10, expect: ['SAO', 'DOZE', 'E_CONJ', 'DEZ_M'] },
    { h: 12, m: 15, expect: ['SAO', 'DOZE', 'E_CONJ', 'QUARTO'] },
    { h: 12, m: 20, expect: ['SAO', 'DOZE', 'E_CONJ', 'VINTE'] },
    { h: 12, m: 25, expect: ['SAO', 'DOZE', 'E_CONJ', 'VINTE', 'CINCO_M'] },
    { h: 12, m: 30, expect: ['SAO', 'DOZE', 'E_CONJ', 'MEIA'] },
    { h: 12, m: 35, expect: ['E_VERB', 'UMA', 'MENOS', 'VINTE', 'CINCO_M'] },
    { h: 12, m: 40, expect: ['E_VERB', 'UMA', 'MENOS', 'VINTE'] },
    { h: 12, m: 45, expect: ['E_VERB', 'UMA', 'MENOS', 'QUARTO'] },
    { h: 12, m: 50, expect: ['E_VERB', 'UMA', 'MENOS', 'DEZ_M'] },
    { h: 12, m: 55, expect: ['E_VERB', 'UMA', 'MENOS', 'CINCO_M'] },
    { h: 1,  m: 0,  expect: ['E_VERB', 'UMA'] },
    { h: 0,  m: 0,  expect: ['SAO', 'DOZE'] },
  ];

  for (const { h, m, expect: expected } of cases) {
    test(`${h}:${String(m).padStart(2, '0')} -> ${expected.join(' ')}`, () => {
      const result = timeToWords(h, m);
      expect(result).toEqual(expected);
    });
  }

  test('floors to nearest 5 minutes (7:24 -> 7:20)', () => {
    const result = timeToWords(7, 24);
    expect(result).toEqual(['SAO', 'SETE', 'E_CONJ', 'VINTE']);
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
