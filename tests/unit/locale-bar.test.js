import { describe, test, expect } from '@jest/globals';
import { localeBar } from '../../src/locales/bar.js';

const { GRID, WORDS, timeToWords } = localeBar;

describe('Bavarian locale - grid structure', () => {
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

describe('Bavarian locale - word positions match grid', () => {
  test('each word maps to correct letters in grid', () => {
    const expected = {
      ES: 'ES', IS: 'IS', FUNF_M: 'F\u00DCNF',
      ZEHN_M: 'ZEHN', ZWANZG: 'ZWANZG',
      DREIVIERTL: 'DREIVIERTL', VIERTL: 'VIERTL', DREI_H: 'DREI',
      NOCH: 'NOCH', VOR: 'VOR', UHR: 'UHR', HOIB: 'HOIB',
      ZWOIFE: 'ZW\u00D6IFE', OANS: 'OANS', ZWOA: 'ZWOA', EIFE: 'EIFE',
      SECHSE: 'SECHSE', FUNFE: 'F\u00DCNFE', SIEBNE: 'SIEBNE',
      ACHTE: 'ACHTE', NEINE: 'NEINE', VIARE: 'VIARE', ZEHNE: 'ZEHNE',
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

describe('Bavarian locale - timeToWords', () => {
  const cases = [
    { h: 3, m: 0,  expect: ['ES', 'IS', 'DREI_H', 'UHR'] },
    { h: 3, m: 5,  expect: ['ES', 'IS', 'FUNF_M', 'NOCH', 'DREI_H'] },
    { h: 3, m: 10, expect: ['ES', 'IS', 'ZEHN_M', 'NOCH', 'DREI_H'] },
    { h: 3, m: 15, expect: ['ES', 'IS', 'VIERTL', 'NOCH', 'DREI_H'] },
    { h: 3, m: 20, expect: ['ES', 'IS', 'ZWANZG', 'NOCH', 'DREI_H'] },
    { h: 3, m: 25, expect: ['ES', 'IS', 'FUNF_M', 'VOR', 'HOIB', 'VIARE'] },
    { h: 3, m: 30, expect: ['ES', 'IS', 'HOIB', 'VIARE'] },
    { h: 3, m: 35, expect: ['ES', 'IS', 'FUNF_M', 'NOCH', 'HOIB', 'VIARE'] },
    { h: 3, m: 40, expect: ['ES', 'IS', 'ZWANZG', 'VOR', 'VIARE'] },
    { h: 3, m: 45, expect: ['ES', 'IS', 'DREIVIERTL', 'VIARE'] },
    { h: 3, m: 50, expect: ['ES', 'IS', 'ZEHN_M', 'VOR', 'VIARE'] },
    { h: 3, m: 55, expect: ['ES', 'IS', 'FUNF_M', 'VOR', 'VIARE'] },
    { h: 0, m: 0,  expect: ['ES', 'IS', 'ZWOIFE', 'UHR'] },
  ];

  for (const { h, m, expect: expected } of cases) {
    test(`${h}:${String(m).padStart(2, '0')} -> ${expected.join(' ')}`, () => {
      const result = timeToWords(h, m);
      expect(result).toEqual(expected);
    });
  }

  test('floors to nearest 5 minutes (7:24 -> 7:20)', () => {
    const result = timeToWords(7, 24);
    expect(result).toEqual(['ES', 'IS', 'ZWANZG', 'NOCH', 'SIEBNE']);
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
