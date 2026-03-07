// Spanish word clock layout - 10 rows x 11 columns

const es_GRID = [
  ['E', 'S', 'K', 'S', 'O', 'N', 'R', 'L', 'A', 'S', 'B'],
  ['L', 'A', 'G', 'U', 'N', 'A', 'D', 'O', 'C', 'E', 'P'],
  ['O', 'N', 'C', 'E', 'F', 'C', 'U', 'A', 'T', 'R', 'O'],
  ['C', 'I', 'N', 'C', 'O', 'J', 'S', 'E', 'I', 'S', 'W'],
  ['S', 'I', 'E', 'T', 'E', 'H', 'T', 'R', 'E', 'S', 'X'],
  ['N', 'U', 'E', 'V', 'E', 'D', 'O', 'C', 'H', 'O', 'Q'],
  ['D', 'O', 'S', 'T', 'D', 'I', 'E', 'Z', 'V', 'N', 'L'],
  ['Y', 'M', 'E', 'N', 'O', 'S', 'D', 'I', 'E', 'Z', 'R'],
  ['V', 'E', 'I', 'N', 'T', 'E', 'M', 'E', 'D', 'I', 'A'],
  ['C', 'I', 'N', 'C', 'O', 'C', 'U', 'A', 'R', 'T', 'O'],
];

const es_WORDS = {
  ES:       { row: 0, col: 0, length: 2 },
  SON:      { row: 0, col: 3, length: 3 },
  LAS:      { row: 0, col: 7, length: 3 },
  LA:       { row: 1, col: 0, length: 2 },
  UNA:      { row: 1, col: 3, length: 3 },
  DOCE:     { row: 1, col: 6, length: 4 },
  ONCE:     { row: 2, col: 0, length: 4 },
  CUATRO:   { row: 2, col: 5, length: 6 },
  CINCO_H:  { row: 3, col: 0, length: 5 },
  SEIS:     { row: 3, col: 6, length: 4 },
  SIETE:    { row: 4, col: 0, length: 5 },
  TRES:     { row: 4, col: 6, length: 4 },
  NUEVE:    { row: 5, col: 0, length: 5 },
  OCHO:     { row: 5, col: 6, length: 4 },
  DOS:      { row: 6, col: 0, length: 3 },
  DIEZ_H:   { row: 6, col: 4, length: 4 },
  Y:        { row: 7, col: 0, length: 1 },
  MENOS:    { row: 7, col: 1, length: 5 },
  DIEZ_M:   { row: 7, col: 6, length: 4 },
  VEINTE:   { row: 8, col: 0, length: 6 },
  MEDIA:    { row: 8, col: 6, length: 5 },
  CINCO_M:  { row: 9, col: 0, length: 5 },
  CUARTO:   { row: 9, col: 5, length: 6 },
};

function es_getHourWord(h) {
  const hour12 = ((h % 12) || 12);
  const map = {
    1: 'UNA', 2: 'DOS', 3: 'TRES', 4: 'CUATRO',
    5: 'CINCO_H', 6: 'SEIS', 7: 'SIETE', 8: 'OCHO',
    9: 'NUEVE', 10: 'DIEZ_H', 11: 'ONCE', 12: 'DOCE',
  };
  return map[hour12];
}

function es_timeToWords(hours, minutes) {
  const min5 = Math.floor(minutes / 5) * 5;

  let displayHour = hours;

  if (min5 >= 35) {
    displayHour = hours + 1;
  }

  const h12 = ((displayHour % 12) || 12);
  const hourWord = es_getHourWord(displayHour);

  const words = h12 === 1 ? ['ES', 'LA'] : ['SON', 'LAS'];
  words.push(hourWord);

  switch (min5) {
    case 0:
      break;
    case 5:
      words.push('Y', 'CINCO_M');
      break;
    case 10:
      words.push('Y', 'DIEZ_M');
      break;
    case 15:
      words.push('Y', 'CUARTO');
      break;
    case 20:
      words.push('Y', 'VEINTE');
      break;
    case 25:
      words.push('Y', 'VEINTE', 'CINCO_M');
      break;
    case 30:
      words.push('Y', 'MEDIA');
      break;
    case 35:
      words.push('MENOS', 'VEINTE', 'CINCO_M');
      break;
    case 40:
      words.push('MENOS', 'VEINTE');
      break;
    case 45:
      words.push('MENOS', 'CUARTO');
      break;
    case 50:
      words.push('MENOS', 'DIEZ_M');
      break;
    case 55:
      words.push('MENOS', 'CINCO_M');
      break;
  }

  return words;
}

export const localeEs = {
  GRID: es_GRID,
  WORDS: es_WORDS,
  LOCALE_NAME: 'Español',
  MINUTE_LABEL: 'MINUTOS',
  MINUTE_LABEL_SINGULAR: 'MINUTO',
  timeToWords: es_timeToWords,
};
