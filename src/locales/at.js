// Austrian German (Österreichisch) word clock layout - 10 rows x 11 columns
// Same grid as standard German, but uses "Viertel/Dreiviertel [next hour]" convention

const at_GRID = [
  ['E', 'S', 'K', 'I', 'S', 'T', 'L', 'F', 'Ü', 'N', 'F'],
  ['Z', 'E', 'H', 'N', 'Z', 'W', 'A', 'N', 'Z', 'I', 'G'],
  ['D', 'R', 'E', 'I', 'V', 'I', 'E', 'R', 'T', 'E', 'L'],
  ['T', 'N', 'A', 'C', 'H', 'V', 'O', 'R', 'J', 'M', 'X'],
  ['H', 'A', 'L', 'B', 'Q', 'Z', 'W', 'Ö', 'L', 'F', 'P'],
  ['Z', 'W', 'E', 'I', 'N', 'S', 'I', 'E', 'B', 'E', 'N'],
  ['K', 'D', 'R', 'E', 'I', 'R', 'H', 'F', 'Ü', 'N', 'F'],
  ['E', 'L', 'F', 'N', 'E', 'U', 'N', 'V', 'I', 'E', 'R'],
  ['W', 'A', 'C', 'H', 'T', 'Z', 'E', 'H', 'N', 'R', 'S'],
  ['B', 'S', 'E', 'C', 'H', 'S', 'F', 'M', 'U', 'H', 'R'],
];

const at_WORDS = {
  ES:       { row: 0, col: 0, length: 2 },
  IST:      { row: 0, col: 3, length: 3 },
  FUNF_M:   { row: 0, col: 7, length: 4 },
  ZEHN_M:   { row: 1, col: 0, length: 4 },
  ZWANZIG:  { row: 1, col: 4, length: 7 },
  DREIVIERTEL: { row: 2, col: 0, length: 11 },
  VIERTEL:  { row: 2, col: 4, length: 7 },
  NACH:     { row: 3, col: 1, length: 4 },
  VOR:      { row: 3, col: 5, length: 3 },
  HALB:     { row: 4, col: 0, length: 4 },
  ZWOLF:    { row: 4, col: 5, length: 5 },
  ZWEI:     { row: 5, col: 0, length: 4 },
  EIN:      { row: 5, col: 2, length: 3 },
  EINS:     { row: 5, col: 2, length: 4 },
  SIEBEN:   { row: 5, col: 5, length: 6 },
  DREI_H:   { row: 6, col: 1, length: 4 },
  FUNF_H:   { row: 6, col: 7, length: 4 },
  ELF:      { row: 7, col: 0, length: 3 },
  NEUN:     { row: 7, col: 3, length: 4 },
  VIER:     { row: 7, col: 7, length: 4 },
  ACHT:     { row: 8, col: 1, length: 4 },
  ZEHN_H:   { row: 8, col: 5, length: 4 },
  SECHS:    { row: 9, col: 1, length: 5 },
  UHR:      { row: 9, col: 8, length: 3 },
};

function at_getHourWord(h) {
  const hour12 = ((h % 12) || 12);
  const map = {
    1: 'EINS', 2: 'ZWEI', 3: 'DREI_H', 4: 'VIER',
    5: 'FUNF_H', 6: 'SECHS', 7: 'SIEBEN', 8: 'ACHT',
    9: 'NEUN', 10: 'ZEHN_H', 11: 'ELF', 12: 'ZWOLF',
  };
  return map[hour12];
}

function at_timeToWords(hours, minutes) {
  const min5 = Math.floor(minutes / 5) * 5;

  // Austrian convention: reference next hour from :15 onward
  let displayHour = hours;

  if (min5 >= 15) {
    displayHour = hours + 1;
  }

  displayHour = ((displayHour % 12) || 12);

  const words = ['ES', 'IST'];
  const hourWord = (min5 === 0 && displayHour === 1) ? 'EIN' : at_getHourWord(displayHour);

  switch (min5) {
    case 0:
      words.push(hourWord, 'UHR');
      break;
    case 5:
      words.push('FUNF_M', 'NACH', at_getHourWord(hours));
      break;
    case 10:
      words.push('ZEHN_M', 'NACH', at_getHourWord(hours));
      break;
    case 15:
      // Austrian: "VIERTEL [next hour]" (no NACH)
      words.push('VIERTEL', hourWord);
      break;
    case 20:
      words.push('ZWANZIG', 'NACH', at_getHourWord(hours));
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
      words.push('ZWANZIG', 'VOR', hourWord);
      break;
    case 45:
      // Austrian: "DREIVIERTEL [next hour]" (no VOR)
      words.push('DREIVIERTEL', hourWord);
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

export const localeAt = {
  GRID: at_GRID,
  WORDS: at_WORDS,
  LOCALE_NAME: 'Österreichisch',
  MINUTE_LABEL: 'MINUTEN',
  MINUTE_LABEL_SINGULAR: 'MINUTE',
  timeToWords: at_timeToWords,
};
