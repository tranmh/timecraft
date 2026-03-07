// Bavarian word clock layout - 10 rows x 11 columns

const bar_GRID = [
  ['E', 'S', 'K', 'I', 'S', 'P', 'F', '\u00DC', 'N', 'F', 'W'],
  ['Z', 'E', 'H', 'N', 'Z', 'W', 'A', 'N', 'Z', 'G', 'B'],
  ['D', 'R', 'E', 'I', 'V', 'I', 'E', 'R', 'T', 'L', 'J'],
  ['N', 'O', 'C', 'H', 'V', 'O', 'R', 'H', 'O', 'I', 'B'],
  ['O', 'A', 'N', 'S', 'G', 'S', 'E', 'C', 'H', 'S', 'E'],
  ['Z', 'W', 'O', 'A', 'L', 'S', 'I', 'E', 'B', 'N', 'E'],
  ['V', 'I', 'A', 'R', 'E', 'Z', 'W', '\u00D6', 'I', 'F', 'E'],
  ['F', '\u00DC', 'N', 'F', 'E', 'A', 'C', 'H', 'T', 'E', 'M'],
  ['N', 'E', 'I', 'N', 'E', 'Z', 'E', 'H', 'N', 'E', 'T'],
  ['E', 'I', 'F', 'E', 'D', 'R', 'E', 'I', 'U', 'H', 'R'],
];

const bar_WORDS = {
  ES:          { row: 0, col: 0, length: 2 },
  IS:          { row: 0, col: 3, length: 2 },
  FUNF_M:      { row: 0, col: 6, length: 4 },
  ZEHN_M:      { row: 1, col: 0, length: 4 },
  ZWANZG:      { row: 1, col: 4, length: 6 },
  DREIVIERTL:  { row: 2, col: 0, length: 10 },
  VIERTL:      { row: 2, col: 4, length: 6 },
  NOCH:        { row: 3, col: 0, length: 4 },
  VOR:         { row: 3, col: 4, length: 3 },
  HOIB:        { row: 3, col: 7, length: 4 },
  OANS:        { row: 4, col: 0, length: 4 },
  SECHSE:      { row: 4, col: 5, length: 6 },
  ZWOA:        { row: 5, col: 0, length: 4 },
  SIEBNE:      { row: 5, col: 5, length: 6 },
  VIARE:       { row: 6, col: 0, length: 5 },
  ZWOIFE:      { row: 6, col: 5, length: 6 },
  FUNFE:       { row: 7, col: 0, length: 5 },
  ACHTE:       { row: 7, col: 5, length: 5 },
  NEINE:       { row: 8, col: 0, length: 5 },
  ZEHNE:       { row: 8, col: 5, length: 5 },
  EIFE:        { row: 9, col: 0, length: 4 },
  DREI_H:      { row: 9, col: 4, length: 4 },
  UHR:         { row: 9, col: 8, length: 3 },
};

function bar_getHourWord(h) {
  const hour12 = ((h % 12) || 12);
  const map = {
    1: 'OANS', 2: 'ZWOA', 3: 'DREI_H', 4: 'VIARE',
    5: 'FUNFE', 6: 'SECHSE', 7: 'SIEBNE', 8: 'ACHTE',
    9: 'NEINE', 10: 'ZEHNE', 11: 'EIFE', 12: 'ZWOIFE',
  };
  return map[hour12];
}

function bar_timeToWords(hours, minutes) {
  const min5 = Math.floor(minutes / 5) * 5;

  let displayHour = hours;

  if (min5 >= 25) {
    displayHour = hours + 1;
  }

  displayHour = ((displayHour % 12) || 12);

  const words = ['ES', 'IS'];
  const hourWord = bar_getHourWord(displayHour);

  switch (min5) {
    case 0:
      words.push(bar_getHourWord(hours), 'UHR');
      break;
    case 5:
      words.push('FUNF_M', 'NOCH', bar_getHourWord(hours));
      break;
    case 10:
      words.push('ZEHN_M', 'NOCH', bar_getHourWord(hours));
      break;
    case 15:
      words.push('VIERTL', 'NOCH', bar_getHourWord(hours));
      break;
    case 20:
      words.push('ZWANZG', 'NOCH', bar_getHourWord(hours));
      break;
    case 25:
      words.push('FUNF_M', 'VOR', 'HOIB', hourWord);
      break;
    case 30:
      words.push('HOIB', hourWord);
      break;
    case 35:
      words.push('FUNF_M', 'NOCH', 'HOIB', hourWord);
      break;
    case 40:
      words.push('ZWANZG', 'VOR', hourWord);
      break;
    case 45:
      words.push('DREIVIERTL', hourWord);
      break;
    case 50:
      words.push('ZEHN_M', 'VOR', hourWord);
      break;
    case 55:
      words.push('FUNF_M', 'VOR', hourWord);
      break;
  }

  return words;
}

export const localeBar = {
  GRID: bar_GRID,
  WORDS: bar_WORDS,
  LOCALE_NAME: 'Boarisch',
  MINUTE_LABEL: 'MINUTN',
  MINUTE_LABEL_SINGULAR: 'MINUTN',
  timeToWords: bar_timeToWords,
};
