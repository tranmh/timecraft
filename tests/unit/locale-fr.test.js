import { describe, test, expect } from '@jest/globals';
import { localeFr } from '../../src/locales/fr.js';

const { GRID, WORDS, timeToWords } = localeFr;

describe('French locale - grid structure', () => {
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

describe('French locale - word positions match grid', () => {
  test('each word maps to correct letters in grid', () => {
    const expected = {
      IL: 'IL', EST: 'EST', DEUX: 'DEUX',
      TROIS: 'TROIS', QUATRE: 'QUATRE',
      NEUF: 'NEUF', UNE: 'UNE', ONZE: 'ONZE',
      SEPT: 'SEPT', HUIT: 'HUIT', SIX: 'SIX',
      DOUZE: 'DOUZE', CINQ_H: 'CINQ',
      DIX_H: 'DIX', HEURES: 'HEURES', HEURE: 'HEURE',
      ET: 'ET', MOINS: 'MOINS',
      VINGT: 'VINGT', CINQ_M: 'CINQ',
      DIX_M: 'DIX', QUART: 'QUART',
      DEMIE: 'DEMIE', LE: 'LE',
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

describe('French locale - timeToWords', () => {
  const cases = [
    { h: 12, m: 0,  expect: ['IL', 'EST', 'DOUZE', 'HEURES'] },
    { h: 12, m: 5,  expect: ['IL', 'EST', 'DOUZE', 'HEURES', 'CINQ_M'] },
    { h: 12, m: 10, expect: ['IL', 'EST', 'DOUZE', 'HEURES', 'DIX_M'] },
    { h: 12, m: 15, expect: ['IL', 'EST', 'DOUZE', 'HEURES', 'ET', 'QUART'] },
    { h: 12, m: 20, expect: ['IL', 'EST', 'DOUZE', 'HEURES', 'VINGT'] },
    { h: 12, m: 25, expect: ['IL', 'EST', 'DOUZE', 'HEURES', 'VINGT', 'CINQ_M'] },
    { h: 12, m: 30, expect: ['IL', 'EST', 'DOUZE', 'HEURES', 'ET', 'DEMIE'] },
    { h: 12, m: 35, expect: ['IL', 'EST', 'UNE', 'HEURE', 'MOINS', 'VINGT', 'CINQ_M'] },
    { h: 12, m: 40, expect: ['IL', 'EST', 'UNE', 'HEURE', 'MOINS', 'VINGT'] },
    { h: 12, m: 45, expect: ['IL', 'EST', 'UNE', 'HEURE', 'MOINS', 'LE', 'QUART'] },
    { h: 12, m: 50, expect: ['IL', 'EST', 'UNE', 'HEURE', 'MOINS', 'DIX_M'] },
    { h: 12, m: 55, expect: ['IL', 'EST', 'UNE', 'HEURE', 'MOINS', 'CINQ_M'] },
    { h: 1,  m: 0,  expect: ['IL', 'EST', 'UNE', 'HEURE'] },
    { h: 0,  m: 0,  expect: ['IL', 'EST', 'DOUZE', 'HEURES'] },
  ];

  for (const { h, m, expect: expected } of cases) {
    test(`${h}:${String(m).padStart(2, '0')} -> ${expected.join(' ')}`, () => {
      const result = timeToWords(h, m);
      expect(result).toEqual(expected);
    });
  }

  test('floors to nearest 5 minutes (7:24 -> 7:20)', () => {
    const result = timeToWords(7, 24);
    expect(result).toEqual(['IL', 'EST', 'SEPT', 'HEURES', 'VINGT']);
  });

  test('all 5-minute intervals return valid word keys', () => {
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 5) {
        const result = timeToWords(h, m);
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBeGreaterThan(0);
        expect(result[0]).toBe('IL');
        expect(result[1]).toBe('EST');
        for (const key of result) {
          expect(WORDS[key]).toBeDefined();
        }
      }
    }
  });
});
