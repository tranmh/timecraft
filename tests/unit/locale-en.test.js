import { describe, test, expect } from '@jest/globals';
import { localeEn } from '../../src/locales/en.js';

const { GRID, WORDS, timeToWords } = localeEn;

describe('English locale - grid structure', () => {
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

describe('English locale - word positions match grid', () => {
  test('each word maps to correct letters in grid', () => {
    const expected = {
      IT: 'IT', IS: 'IS', FIVE_M: 'FIVE', QUARTER: 'QUARTER', TEN_M: 'TEN',
      TWENTY: 'TWENTY', FIVE_M2: 'FIVE', HALF: 'HALF', TO: 'TO', PAST: 'PAST',
      NINE: 'NINE', ONE: 'ONE', SIX: 'SIX', THREE: 'THREE', FOUR: 'FOUR',
      FIVE_H: 'FIVE', TWO: 'TWO', EIGHT: 'EIGHT', ELEVEN: 'ELEVEN',
      SEVEN: 'SEVEN', TWELVE: 'TWELVE', TEN_H: 'TEN', OCLOCK: 'OCLOCK',
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

describe('English locale - timeToWords', () => {
  const cases = [
    { h: 12, m: 0,  expect: ['IT', 'IS', 'TWELVE', 'OCLOCK'] },
    { h: 12, m: 5,  expect: ['IT', 'IS', 'FIVE_M', 'PAST', 'TWELVE'] },
    { h: 12, m: 10, expect: ['IT', 'IS', 'TEN_M', 'PAST', 'TWELVE'] },
    { h: 12, m: 15, expect: ['IT', 'IS', 'QUARTER', 'PAST', 'TWELVE'] },
    { h: 12, m: 20, expect: ['IT', 'IS', 'TWENTY', 'PAST', 'TWELVE'] },
    { h: 12, m: 25, expect: ['IT', 'IS', 'TWENTY', 'FIVE_M2', 'PAST', 'TWELVE'] },
    { h: 12, m: 30, expect: ['IT', 'IS', 'HALF', 'PAST', 'TWELVE'] },
    { h: 12, m: 35, expect: ['IT', 'IS', 'TWENTY', 'FIVE_M2', 'TO', 'ONE'] },
    { h: 12, m: 40, expect: ['IT', 'IS', 'TWENTY', 'TO', 'ONE'] },
    { h: 12, m: 45, expect: ['IT', 'IS', 'QUARTER', 'TO', 'ONE'] },
    { h: 12, m: 50, expect: ['IT', 'IS', 'TEN_M', 'TO', 'ONE'] },
    { h: 12, m: 55, expect: ['IT', 'IS', 'FIVE_M', 'TO', 'ONE'] },
    { h: 0,  m: 0,  expect: ['IT', 'IS', 'TWELVE', 'OCLOCK'] },
  ];

  for (const { h, m, expect: expected } of cases) {
    test(`${h}:${String(m).padStart(2, '0')} -> ${expected.join(' ')}`, () => {
      const result = timeToWords(h, m);
      expect(result).toEqual(expected);
    });
  }

  test('floors to nearest 5 minutes (7:24 -> 7:20)', () => {
    const result = timeToWords(7, 24);
    expect(result).toEqual(['IT', 'IS', 'TWENTY', 'PAST', 'SEVEN']);
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
