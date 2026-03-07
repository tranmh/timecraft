// English word clock layout - 10 rows x 11 columns

const en_GRID = [
  ['I', 'T', 'L', 'I', 'S', 'B', 'F', 'I', 'V', 'E', 'W'],
  ['Q', 'U', 'A', 'R', 'T', 'E', 'R', 'D', 'T', 'E', 'N'],
  ['T', 'W', 'E', 'N', 'T', 'Y', 'F', 'I', 'V', 'E', 'X'],
  ['H', 'A', 'L', 'F', 'B', 'T', 'E', 'N', 'F', 'T', 'O'],
  ['P', 'A', 'S', 'T', 'E', 'R', 'U', 'N', 'I', 'N', 'E'],
  ['O', 'N', 'E', 'S', 'I', 'X', 'T', 'H', 'R', 'E', 'E'],
  ['F', 'O', 'U', 'R', 'F', 'I', 'V', 'E', 'T', 'W', 'O'],
  ['E', 'I', 'G', 'H', 'T', 'E', 'L', 'E', 'V', 'E', 'N'],
  ['S', 'E', 'V', 'E', 'N', 'T', 'W', 'E', 'L', 'V', 'E'],
  ['T', 'E', 'N', 'S', 'E', 'O', 'C', 'L', 'O', 'C', 'K'],
];

const en_WORDS = {
  IT:       { row: 0, col: 0, length: 2 },
  IS:       { row: 0, col: 3, length: 2 },
  FIVE_M:   { row: 0, col: 6, length: 4 },
  QUARTER:  { row: 1, col: 0, length: 7 },
  TEN_M:    { row: 1, col: 8, length: 3 },
  TWENTY:   { row: 2, col: 0, length: 6 },
  FIVE_M2:  { row: 2, col: 6, length: 4 },
  HALF:     { row: 3, col: 0, length: 4 },
  TEN_M2:   { row: 3, col: 5, length: 3 },
  TO:       { row: 3, col: 9, length: 2 },
  PAST:     { row: 4, col: 0, length: 4 },
  NINE:     { row: 4, col: 7, length: 4 },
  ONE:      { row: 5, col: 0, length: 3 },
  SIX:      { row: 5, col: 3, length: 3 },
  THREE:    { row: 5, col: 6, length: 5 },
  FOUR:     { row: 6, col: 0, length: 4 },
  FIVE_H:   { row: 6, col: 4, length: 4 },
  TWO:      { row: 6, col: 8, length: 3 },
  EIGHT:    { row: 7, col: 0, length: 5 },
  ELEVEN:   { row: 7, col: 5, length: 6 },
  SEVEN:    { row: 8, col: 0, length: 5 },
  TWELVE:   { row: 8, col: 5, length: 6 },
  TEN_H:    { row: 9, col: 0, length: 3 },
  OCLOCK:   { row: 9, col: 5, length: 6 },
};

function en_getHourWord(h) {
  const hour12 = ((h % 12) || 12);
  const map = {
    1: 'ONE', 2: 'TWO', 3: 'THREE', 4: 'FOUR',
    5: 'FIVE_H', 6: 'SIX', 7: 'SEVEN', 8: 'EIGHT',
    9: 'NINE', 10: 'TEN_H', 11: 'ELEVEN', 12: 'TWELVE',
  };
  return map[hour12];
}

function en_timeToWords(hours, minutes) {
  const min5 = Math.floor(minutes / 5) * 5;

  let displayHour = hours;

  if (min5 >= 35) {
    displayHour = hours + 1;
  }

  displayHour = ((displayHour % 12) || 12);

  const words = ['IT', 'IS'];
  const hourWord = en_getHourWord(displayHour);

  switch (min5) {
    case 0:
      words.push(hourWord, 'OCLOCK');
      break;
    case 5:
      words.push('FIVE_M', 'PAST', en_getHourWord(hours));
      break;
    case 10:
      words.push('TEN_M', 'PAST', en_getHourWord(hours));
      break;
    case 15:
      words.push('QUARTER', 'PAST', en_getHourWord(hours));
      break;
    case 20:
      words.push('TWENTY', 'PAST', en_getHourWord(hours));
      break;
    case 25:
      words.push('TWENTY', 'FIVE_M2', 'PAST', en_getHourWord(hours));
      break;
    case 30:
      words.push('HALF', 'PAST', en_getHourWord(hours));
      break;
    case 35:
      words.push('TWENTY', 'FIVE_M2', 'TO', hourWord);
      break;
    case 40:
      words.push('TWENTY', 'TO', hourWord);
      break;
    case 45:
      words.push('QUARTER', 'TO', hourWord);
      break;
    case 50:
      words.push('TEN_M', 'TO', hourWord);
      break;
    case 55:
      words.push('FIVE_M', 'TO', hourWord);
      break;
  }

  return words;
}

export const localeEn = {
  GRID: en_GRID,
  WORDS: en_WORDS,
  LOCALE_NAME: 'English',
  MINUTE_LABEL: 'MINUTES',
  MINUTE_LABEL_SINGULAR: 'MINUTE',
  timeToWords: en_timeToWords,
};
