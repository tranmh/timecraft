import { describe, test, expect } from '@jest/globals';
import { localeSwg } from '../../src/locales/swg.js';

const { GRID, WORDS, timeToWords } = localeSwg;

describe('Swabian locale - grid structure', () => {
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

describe('Swabian locale - word positions match grid', () => {
  test('each word maps to correct letters in grid', () => {
    const expected = {
      ES: 'ES', ISCH: 'ISCH', FUNF_M: 'F\u00DCNF',
      ZEAH: 'ZEAH', ZWANZG: 'ZWANZG',
      DREIVIERTEL: 'DREIVIERTEL', VIERTEL: 'VIERTEL',
      NACH: 'NACH', VOR: 'VOR', UHR: 'UHR', HALB: 'HALB',
      ZWOLFE: 'ZW\u00D6LFE', OIS: 'OIS', ZWOI: 'ZWOI', ELFE: 'ELFE',
      SECHSE: 'SECHSE', FUNFE: 'F\u00DCNFE', SIEBNE: 'SIEBNE', ACHDE: 'ACHDE',
      DREI: 'DREI', NEUNE: 'NEUNE', VIERE: 'VIERE', ZEHNE: 'ZEHNE',
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

describe('Swabian locale - timeToWords', () => {
  const cases = [
    { h: 3, m: 0,  expect: ['ES', 'ISCH', 'DREI', 'UHR'] },
    { h: 3, m: 5,  expect: ['ES', 'ISCH', 'FUNF_M', 'NACH', 'DREI'] },
    { h: 3, m: 10, expect: ['ES', 'ISCH', 'ZEAH', 'NACH', 'DREI'] },
    { h: 3, m: 15, expect: ['ES', 'ISCH', 'VIERTEL', 'VIERE'] },
    { h: 3, m: 20, expect: ['ES', 'ISCH', 'ZEAH', 'VOR', 'HALB', 'VIERE'] },
    { h: 3, m: 25, expect: ['ES', 'ISCH', 'FUNF_M', 'VOR', 'HALB', 'VIERE'] },
    { h: 3, m: 30, expect: ['ES', 'ISCH', 'HALB', 'VIERE'] },
    { h: 3, m: 35, expect: ['ES', 'ISCH', 'FUNF_M', 'NACH', 'HALB', 'VIERE'] },
    { h: 3, m: 40, expect: ['ES', 'ISCH', 'ZWANZG', 'VOR', 'VIERE'] },
    { h: 3, m: 45, expect: ['ES', 'ISCH', 'DREIVIERTEL', 'VIERE'] },
    { h: 3, m: 50, expect: ['ES', 'ISCH', 'ZEAH', 'VOR', 'VIERE'] },
    { h: 3, m: 55, expect: ['ES', 'ISCH', 'FUNF_M', 'VOR', 'VIERE'] },
    { h: 0, m: 0,  expect: ['ES', 'ISCH', 'ZWOLFE', 'UHR'] },
  ];

  for (const { h, m, expect: expected } of cases) {
    test(`${h}:${String(m).padStart(2, '0')} -> ${expected.join(' ')}`, () => {
      const result = timeToWords(h, m);
      expect(result).toEqual(expected);
    });
  }

  test('floors to nearest 5 minutes (7:24 -> 7:20)', () => {
    const result = timeToWords(7, 24);
    expect(result).toEqual(['ES', 'ISCH', 'ZEAH', 'VOR', 'HALB', 'ACHDE']);
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
