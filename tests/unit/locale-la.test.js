import { describe, test, expect } from '@jest/globals';
import { localeLa } from '../../src/locales/la.js';

const { GRID, WORDS, timeToWords } = localeLa;

describe('Latin locale - grid structure', () => {
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

describe('Latin locale - word positions match grid', () => {
  test('each word maps to correct letters in grid', () => {
    const expected = {
      HORA: 'HORA', EST: 'EST',
      QUINQUE_M: 'QUINQUE', DECEM_M: 'DECEM', QUARTA: 'QUARTA',
      VIGINTI: 'VIGINTI', DIMIDIA: 'DIMIDIA', ET: 'ET', ANTE: 'ANTE',
      UNA: 'UNA', DUAE: 'DUAE', TRES: 'TRES', QUATTUOR: 'QUATTUOR',
      QUINQUE_H: 'QUINQUE', SEX: 'SEX', SEPTEM: 'SEPTEM', OCTO: 'OCTO',
      NOVEM: 'NOVEM', DECEM_H: 'DECEM', UNDECIM: 'UNDECIM', DUODECIM: 'DUODECIM',
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

describe('Latin locale - timeToWords', () => {
  const cases = [
    { h: 12, m: 0,  expect: ['HORA', 'EST', 'DUODECIM'] },
    { h: 12, m: 5,  expect: ['HORA', 'EST', 'ET', 'QUINQUE_M', 'DUODECIM'] },
    { h: 12, m: 10, expect: ['HORA', 'EST', 'DECEM_M', 'ET', 'DUODECIM'] },
    { h: 12, m: 15, expect: ['HORA', 'EST', 'ET', 'QUARTA', 'DUODECIM'] },
    { h: 12, m: 20, expect: ['HORA', 'VIGINTI', 'EST', 'ET', 'DUODECIM'] },
    { h: 12, m: 25, expect: ['HORA', 'VIGINTI', 'EST', 'ET', 'QUINQUE_M', 'DUODECIM'] },
    { h: 12, m: 30, expect: ['HORA', 'EST', 'ET', 'DIMIDIA', 'DUODECIM'] },
    { h: 12, m: 35, expect: ['HORA', 'VIGINTI', 'EST', 'ANTE', 'QUINQUE_M', 'UNA'] },
    { h: 12, m: 40, expect: ['HORA', 'VIGINTI', 'EST', 'ANTE', 'UNA'] },
    { h: 12, m: 45, expect: ['HORA', 'EST', 'QUARTA', 'ANTE', 'UNA'] },
    { h: 12, m: 50, expect: ['HORA', 'EST', 'DECEM_M', 'ANTE', 'UNA'] },
    { h: 12, m: 55, expect: ['HORA', 'EST', 'ANTE', 'QUINQUE_M', 'UNA'] },
    { h: 0,  m: 0,  expect: ['HORA', 'EST', 'DUODECIM'] },
  ];

  for (const { h, m, expect: expected } of cases) {
    test(`${h}:${String(m).padStart(2, '0')} -> ${expected.join(' ')}`, () => {
      const result = timeToWords(h, m);
      expect(result).toEqual(expected);
    });
  }

  test('floors to nearest 5 minutes (7:24 -> 7:20)', () => {
    const result = timeToWords(7, 24);
    expect(result).toEqual(['HORA', 'VIGINTI', 'EST', 'ET', 'SEPTEM']);
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
