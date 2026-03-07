// Saxon word clock layout - 10 rows x 11 columns

const sxu_GRID = [
  ['E', 'S', 'I', 'S', 'Z', 'W', 'A', 'N', 'Z', 'G', 'K'],
  ['D', 'R', 'E', 'I', 'V', 'I', 'E', 'R', 'D', 'L', 'W'],
  ['F', '\u00DC', 'M', 'F', 'Z', 'E', 'H', 'N', 'V', 'O', 'R'],
  ['N', 'A', 'C', 'H', 'H', 'A', 'L', 'B', 'E', 'B', 'D'],
  ['S', 'E', 'C', 'H', 'S', 'E', 'F', '\u00DC', 'M', 'F', 'E'],
  ['S', 'I', 'E', 'B', 'N', 'E', 'A', 'C', 'H', 'D', 'E'],
  ['N', 'E', 'U', 'N', 'E', 'Z', 'W', '\u00D6', 'L', 'F', 'E'],
  ['E', 'L', 'F', 'E', 'D', 'R', 'E', 'I', 'P', 'Q', 'J'],
  ['V', 'I', 'E', 'R', 'E', 'Z', 'E', 'H', 'N', 'E', 'X'],
  ['E', 'E', 'N', 'S', 'Z', 'W', 'E', 'E', 'U', 'H', 'R'],
];

const sxu_WORDS = {
  ES:          { row: 0, col: 0, length: 2 },
  IS:          { row: 0, col: 2, length: 2 },
  ZWANZG:      { row: 0, col: 4, length: 6 },
  DREIVIERDL:  { row: 1, col: 0, length: 10 },
  VIERDL:      { row: 1, col: 4, length: 6 },
  FUMF_M:      { row: 2, col: 0, length: 4 },
  ZEHN_M:      { row: 2, col: 4, length: 4 },
  VOR:         { row: 2, col: 8, length: 3 },
  NACH:        { row: 3, col: 0, length: 4 },
  HALBE:       { row: 3, col: 4, length: 5 },
  SECHSE:      { row: 4, col: 0, length: 6 },
  FUMFE:       { row: 4, col: 6, length: 5 },
  SIEBNE:      { row: 5, col: 0, length: 6 },
  ACHDE:       { row: 5, col: 6, length: 5 },
  NEUNE:       { row: 6, col: 0, length: 5 },
  ZWOLFE:      { row: 6, col: 5, length: 6 },
  ELFE:        { row: 7, col: 0, length: 4 },
  DREI_H:      { row: 7, col: 4, length: 4 },
  VIERE:       { row: 8, col: 0, length: 5 },
  ZEHNE:       { row: 8, col: 5, length: 5 },
  EENS:        { row: 9, col: 0, length: 4 },
  ZWEE:        { row: 9, col: 4, length: 4 },
  UHR:         { row: 9, col: 8, length: 3 },
};

function sxu_getHourWord(h) {
  const hour12 = ((h % 12) || 12);
  const map = {
    1: 'EENS', 2: 'ZWEE', 3: 'DREI_H', 4: 'VIERE',
    5: 'FUMFE', 6: 'SECHSE', 7: 'SIEBNE', 8: 'ACHDE',
    9: 'NEUNE', 10: 'ZEHNE', 11: 'ELFE', 12: 'ZWOLFE',
  };
  return map[hour12];
}

function sxu_timeToWords(hours, minutes) {
  const min5 = Math.floor(minutes / 5) * 5;

  let displayHour = hours;

  if (min5 >= 15) {
    displayHour = hours + 1;
  }

  displayHour = ((displayHour % 12) || 12);

  const words = ['ES', 'IS'];
  const hourWord = sxu_getHourWord(displayHour);

  switch (min5) {
    case 0:
      words.push(sxu_getHourWord(hours), 'UHR');
      break;
    case 5:
      words.push('FUMF_M', 'NACH', sxu_getHourWord(hours));
      break;
    case 10:
      words.push('ZEHN_M', 'NACH', sxu_getHourWord(hours));
      break;
    case 15:
      words.push('VIERDL', hourWord);
      break;
    case 20:
      words.push('ZEHN_M', 'VOR', 'HALBE', hourWord);
      break;
    case 25:
      words.push('FUMF_M', 'VOR', 'HALBE', hourWord);
      break;
    case 30:
      words.push('HALBE', hourWord);
      break;
    case 35:
      words.push('FUMF_M', 'NACH', 'HALBE', hourWord);
      break;
    case 40:
      words.push('ZWANZG', 'VOR', hourWord);
      break;
    case 45:
      words.push('DREIVIERDL', hourWord);
      break;
    case 50:
      words.push('ZEHN_M', 'VOR', hourWord);
      break;
    case 55:
      words.push('FUMF_M', 'VOR', hourWord);
      break;
  }

  return words;
}

export const localeSxu = {
  GRID: sxu_GRID,
  WORDS: sxu_WORDS,
  LOCALE_NAME: 'S\u00E4chsisch',
  MINUTE_LABEL: 'MINUDN',
  MINUTE_LABEL_SINGULAR: 'MINUDE',
  timeToWords: sxu_timeToWords,
};
