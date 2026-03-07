// French word clock layout - 10 rows x 11 columns

const fr_GRID = [
  ['I', 'L', 'R', 'E', 'S', 'T', 'D', 'E', 'U', 'X', 'W'],
  ['T', 'R', 'O', 'I', 'S', 'Q', 'U', 'A', 'T', 'R', 'E'],
  ['N', 'E', 'U', 'F', 'U', 'N', 'E', 'O', 'N', 'Z', 'E'],
  ['S', 'E', 'P', 'T', 'H', 'U', 'I', 'T', 'S', 'I', 'X'],
  ['D', 'O', 'U', 'Z', 'E', 'C', 'I', 'N', 'Q', 'H', 'B'],
  ['D', 'I', 'X', 'H', 'E', 'U', 'R', 'E', 'S', 'F', 'G'],
  ['E', 'T', 'M', 'O', 'I', 'N', 'S', 'V', 'D', 'A', 'C'],
  ['V', 'I', 'N', 'G', 'T', 'C', 'I', 'N', 'Q', 'M', 'K'],
  ['D', 'I', 'X', 'L', 'E', 'Q', 'U', 'A', 'R', 'T', 'N'],
  ['D', 'E', 'M', 'I', 'E', 'P', 'J', 'Y', 'R', 'K', 'F'],
];

const fr_WORDS = {
  IL:       { row: 0, col: 0, length: 2 },
  EST:      { row: 0, col: 3, length: 3 },
  DEUX:     { row: 0, col: 6, length: 4 },
  TROIS:    { row: 1, col: 0, length: 5 },
  QUATRE:   { row: 1, col: 5, length: 6 },
  NEUF:     { row: 2, col: 0, length: 4 },
  UNE:      { row: 2, col: 4, length: 3 },
  ONZE:     { row: 2, col: 7, length: 4 },
  SEPT:     { row: 3, col: 0, length: 4 },
  HUIT:     { row: 3, col: 4, length: 4 },
  SIX:      { row: 3, col: 8, length: 3 },
  DOUZE:    { row: 4, col: 0, length: 5 },
  CINQ_H:   { row: 4, col: 5, length: 4 },
  DIX_H:    { row: 5, col: 0, length: 3 },
  HEURES:   { row: 5, col: 3, length: 6 },
  HEURE:    { row: 5, col: 3, length: 5 },
  ET:       { row: 6, col: 0, length: 2 },
  MOINS:    { row: 6, col: 2, length: 5 },
  VINGT:    { row: 7, col: 0, length: 5 },
  CINQ_M:   { row: 7, col: 5, length: 4 },
  DIX_M:    { row: 8, col: 0, length: 3 },
  LE:       { row: 8, col: 3, length: 2 },
  QUART:    { row: 8, col: 5, length: 5 },
  DEMIE:    { row: 9, col: 0, length: 5 },
};

function fr_getHourWord(h) {
  const hour12 = ((h % 12) || 12);
  const map = {
    1: 'UNE', 2: 'DEUX', 3: 'TROIS', 4: 'QUATRE',
    5: 'CINQ_H', 6: 'SIX', 7: 'SEPT', 8: 'HUIT',
    9: 'NEUF', 10: 'DIX_H', 11: 'ONZE', 12: 'DOUZE',
  };
  return map[hour12];
}

function fr_timeToWords(hours, minutes) {
  const min5 = Math.floor(minutes / 5) * 5;

  let displayHour = hours;

  if (min5 >= 35) {
    displayHour = hours + 1;
  }

  const h12 = ((displayHour % 12) || 12);

  const words = ['IL', 'EST'];
  const hourWord = fr_getHourWord(displayHour);
  const heureWord = (h12 === 1) ? 'HEURE' : 'HEURES';

  switch (min5) {
    case 0:
      words.push(hourWord, heureWord);
      break;
    case 5:
      words.push(fr_getHourWord(hours), (((hours % 12) || 12) === 1) ? 'HEURE' : 'HEURES', 'CINQ_M');
      break;
    case 10:
      words.push(fr_getHourWord(hours), (((hours % 12) || 12) === 1) ? 'HEURE' : 'HEURES', 'DIX_M');
      break;
    case 15:
      words.push(fr_getHourWord(hours), (((hours % 12) || 12) === 1) ? 'HEURE' : 'HEURES', 'ET', 'QUART');
      break;
    case 20:
      words.push(fr_getHourWord(hours), (((hours % 12) || 12) === 1) ? 'HEURE' : 'HEURES', 'VINGT');
      break;
    case 25:
      words.push(fr_getHourWord(hours), (((hours % 12) || 12) === 1) ? 'HEURE' : 'HEURES', 'VINGT', 'CINQ_M');
      break;
    case 30:
      words.push(fr_getHourWord(hours), (((hours % 12) || 12) === 1) ? 'HEURE' : 'HEURES', 'ET', 'DEMIE');
      break;
    case 35:
      words.push(hourWord, heureWord, 'MOINS', 'VINGT', 'CINQ_M');
      break;
    case 40:
      words.push(hourWord, heureWord, 'MOINS', 'VINGT');
      break;
    case 45:
      words.push(hourWord, heureWord, 'MOINS', 'LE', 'QUART');
      break;
    case 50:
      words.push(hourWord, heureWord, 'MOINS', 'DIX_M');
      break;
    case 55:
      words.push(hourWord, heureWord, 'MOINS', 'CINQ_M');
      break;
  }

  return words;
}

export const localeFr = {
  GRID: fr_GRID,
  WORDS: fr_WORDS,
  LOCALE_NAME: 'Français',
  MINUTE_LABEL: 'MINUTES',
  MINUTE_LABEL_SINGULAR: 'MINUTE',
  timeToWords: fr_timeToWords,
};
