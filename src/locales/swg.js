// Swabian word clock layout - 10 rows x 11 columns

const swg_GRID = [
  ['E', 'S', 'C', 'I', 'S', 'C', 'H', 'F', '\u00DC', 'N', 'F'],
  ['Z', 'E', 'A', 'H', 'R', 'Z', 'W', 'A', 'N', 'Z', 'G'],
  ['D', 'R', 'E', 'I', 'V', 'I', 'E', 'R', 'T', 'E', 'L'],
  ['N', 'A', 'C', 'H', 'V', 'O', 'R', 'H', 'A', 'L', 'B'],
  ['S', 'E', 'C', 'H', 'S', 'E', 'F', '\u00DC', 'N', 'F', 'E'],
  ['S', 'I', 'E', 'B', 'N', 'E', 'A', 'C', 'H', 'D', 'E'],
  ['Z', 'W', '\u00D6', 'L', 'F', 'E', 'A', 'E', 'L', 'F', 'E'],
  ['N', 'E', 'U', 'N', 'E', 'Z', 'W', 'O', 'I', 'Q', 'R'],
  ['D', 'R', 'E', 'I', 'W', 'V', 'I', 'E', 'R', 'E', 'C'],
  ['O', 'I', 'S', 'Z', 'E', 'H', 'N', 'E', 'U', 'H', 'R'],
];

const swg_WORDS = {
  ES:           { row: 0, col: 0, length: 2 },
  ISCH:         { row: 0, col: 3, length: 4 },
  FUNF_M:       { row: 0, col: 7, length: 4 },
  ZEAH:         { row: 1, col: 0, length: 4 },
  ZWANZG:       { row: 1, col: 5, length: 6 },
  DREIVIERTEL:  { row: 2, col: 0, length: 11 },
  VIERTEL:      { row: 2, col: 4, length: 7 },
  NACH:         { row: 3, col: 0, length: 4 },
  VOR:          { row: 3, col: 4, length: 3 },
  HALB:         { row: 3, col: 7, length: 4 },
  SECHSE:       { row: 4, col: 0, length: 6 },
  FUNFE:        { row: 4, col: 6, length: 5 },
  SIEBNE:       { row: 5, col: 0, length: 6 },
  ACHDE:        { row: 5, col: 6, length: 5 },
  ZWOLFE:       { row: 6, col: 0, length: 6 },
  ELFE:         { row: 6, col: 7, length: 4 },
  NEUNE:        { row: 7, col: 0, length: 5 },
  ZWOI:         { row: 7, col: 5, length: 4 },
  DREI:         { row: 8, col: 0, length: 4 },
  VIERE:        { row: 8, col: 5, length: 5 },
  OIS:          { row: 9, col: 0, length: 3 },
  ZEHNE:        { row: 9, col: 3, length: 5 },
  UHR:          { row: 9, col: 8, length: 3 },
};

function swg_getHourWord(h) {
  const hour12 = ((h % 12) || 12);
  const map = {
    1: 'OIS', 2: 'ZWOI', 3: 'DREI', 4: 'VIERE',
    5: 'FUNFE', 6: 'SECHSE', 7: 'SIEBNE', 8: 'ACHDE',
    9: 'NEUNE', 10: 'ZEHNE', 11: 'ELFE', 12: 'ZWOLFE',
  };
  return map[hour12];
}

function swg_timeToWords(hours, minutes) {
  const min5 = Math.floor(minutes / 5) * 5;

  let displayHour = hours;

  if (min5 >= 15) {
    displayHour = hours + 1;
  }

  displayHour = ((displayHour % 12) || 12);

  const words = ['ES', 'ISCH'];
  const hourWord = swg_getHourWord(displayHour);

  switch (min5) {
    case 0:
      words.push(swg_getHourWord(hours), 'UHR');
      break;
    case 5:
      words.push('FUNF_M', 'NACH', swg_getHourWord(hours));
      break;
    case 10:
      words.push('ZEAH', 'NACH', swg_getHourWord(hours));
      break;
    case 15:
      words.push('VIERTEL', hourWord);
      break;
    case 20:
      words.push('ZEAH', 'VOR', 'HALB', hourWord);
      break;
    case 25:
      words.push('FUNF_M', 'VOR', 'HALB', hourWord);
      break;
    case 30:
      words.push('HALB', hourWord);
      break;
    case 35:
      words.push('FUNF_M', 'NACH', 'HALB', hourWord);
      break;
    case 40:
      words.push('ZWANZG', 'VOR', hourWord);
      break;
    case 45:
      words.push('DREIVIERTEL', hourWord);
      break;
    case 50:
      words.push('ZEAH', 'VOR', hourWord);
      break;
    case 55:
      words.push('FUNF_M', 'VOR', hourWord);
      break;
  }

  return words;
}

export const localeSwg = {
  GRID: swg_GRID,
  WORDS: swg_WORDS,
  LOCALE_NAME: 'Schw\u00E4bisch',
  MINUTE_LABEL: 'MINUDE',
  MINUTE_LABEL_SINGULAR: 'MINUDE',
  timeToWords: swg_timeToWords,
};
