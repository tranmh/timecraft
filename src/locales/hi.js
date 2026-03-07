// Hindi (Romanized) word clock layout - 10 rows x 11 columns

const hi_GRID = [
  ['A', 'B', 'H', 'I', 'W', 'X', 'Z', 'F', 'J', 'L', 'Q'],
  ['G', 'Y', 'A', 'R', 'A', 'B', 'A', 'R', 'A', 'V', 'R'],
  ['P', 'A', 'N', 'C', 'H', 'D', 'A', 'S', 'C', 'H', 'E'],
  ['T', 'I', 'N', 'C', 'H', 'A', 'R', 'S', 'A', 'T', 'W'],
  ['E', 'K', 'D', 'O', 'A', 'T', 'H', 'N', 'A', 'U', 'X'],
  ['B', 'A', 'J', 'E', 'K', 'A', 'M', 'A', 'D', 'H', 'A'],
  ['S', 'A', 'V', 'B', 'I', 'S', 'D', 'A', 'S', 'Y', 'Z'],
  ['P', 'A', 'N', 'C', 'H', 'F', 'G', 'J', 'L', 'M', 'Q'],
  ['R', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'D', 'F', 'G'],
  ['H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T'],
];

const hi_WORDS = {
  ABHI:     { row: 0, col: 0, length: 4 },
  GYARA:    { row: 1, col: 0, length: 5 },
  BARA:     { row: 1, col: 5, length: 4 },
  PANCH_H:  { row: 2, col: 0, length: 5 },
  DAS_H:    { row: 2, col: 5, length: 3 },
  CHE:      { row: 2, col: 8, length: 3 },
  TIN:      { row: 3, col: 0, length: 3 },
  CHAR:     { row: 3, col: 3, length: 4 },
  SAT:      { row: 3, col: 7, length: 3 },
  EK:       { row: 4, col: 0, length: 2 },
  DO:       { row: 4, col: 2, length: 2 },
  ATH:      { row: 4, col: 4, length: 3 },
  NAU:      { row: 4, col: 7, length: 3 },
  BAJE:     { row: 5, col: 0, length: 4 },
  KAM:      { row: 5, col: 4, length: 3 },
  ADHA:     { row: 5, col: 7, length: 4 },
  SAV:      { row: 6, col: 0, length: 3 },
  BIS_M:    { row: 6, col: 3, length: 3 },
  DAS_M:    { row: 6, col: 6, length: 3 },
  PANCH_M:  { row: 7, col: 0, length: 5 },
};

function hi_getHourWord(h) {
  const hour12 = ((h % 12) || 12);
  const map = {
    1: 'EK', 2: 'DO', 3: 'TIN', 4: 'CHAR',
    5: 'PANCH_H', 6: 'CHE', 7: 'SAT', 8: 'ATH',
    9: 'NAU', 10: 'DAS_H', 11: 'GYARA', 12: 'BARA',
  };
  return map[hour12];
}

function hi_timeToWords(hours, minutes) {
  const min5 = Math.floor(minutes / 5) * 5;

  let displayHour = hours;

  if (min5 >= 35) {
    displayHour = hours + 1;
  }

  displayHour = ((displayHour % 12) || 12);

  const words = ['ABHI'];
  const hourWord = hi_getHourWord(displayHour);

  switch (min5) {
    case 0:
      words.push(hourWord, 'BAJE');
      break;
    case 5:
      words.push(hi_getHourWord(hours), 'PANCH_M');
      break;
    case 10:
      words.push(hi_getHourWord(hours), 'DAS_M');
      break;
    case 15:
      words.push(hi_getHourWord(hours), 'SAV');
      break;
    case 20:
      words.push(hi_getHourWord(hours), 'BIS_M');
      break;
    case 25:
      words.push(hi_getHourWord(hours), 'BIS_M', 'PANCH_M');
      break;
    case 30:
      words.push(hi_getHourWord(hours), 'ADHA');
      break;
    case 35:
      words.push(hourWord, 'KAM', 'BIS_M', 'PANCH_M');
      break;
    case 40:
      words.push(hourWord, 'KAM', 'BIS_M');
      break;
    case 45:
      words.push(hourWord, 'KAM', 'SAV');
      break;
    case 50:
      words.push(hourWord, 'KAM', 'DAS_M');
      break;
    case 55:
      words.push(hourWord, 'KAM', 'PANCH_M');
      break;
  }

  return words;
}

export const localeHi = {
  GRID: hi_GRID,
  WORDS: hi_WORDS,
  LOCALE_NAME: '\u0939\u093F\u0928\u094D\u0926\u0940',
  MINUTE_LABEL: 'MINAT',
  MINUTE_LABEL_SINGULAR: 'MINAT',
  timeToWords: hi_timeToWords,
};
