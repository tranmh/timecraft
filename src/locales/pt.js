// Portuguese word clock layout - 10 rows x 11 columns

const pt_GRID = [
  ['E', 'H', 'S', 'A', 'O', 'D', 'U', 'A', 'S', 'M', 'K'],
  ['U', 'M', 'A', 'D', 'O', 'Z', 'E', 'O', 'N', 'Z', 'E'],
  ['Q', 'U', 'A', 'T', 'R', 'O', 'C', 'I', 'N', 'C', 'O'],
  ['S', 'E', 'I', 'S', 'S', 'E', 'T', 'E', 'B', 'H', 'K'],
  ['O', 'I', 'T', 'O', 'N', 'O', 'V', 'E', 'T', 'G', 'M'],
  ['T', 'R', 'E', 'S', 'D', 'E', 'Z', 'W', 'J', 'L', 'F'],
  ['E', 'M', 'E', 'N', 'O', 'S', 'V', 'I', 'N', 'T', 'E'],
  ['C', 'I', 'N', 'C', 'O', 'D', 'E', 'Z', 'R', 'P', 'Q'],
  ['Q', 'U', 'A', 'R', 'T', 'O', 'M', 'E', 'I', 'A', 'X'],
  ['X', 'W', 'Y', 'Z', 'B', 'C', 'D', 'F', 'G', 'H', 'J'],
];

const pt_WORDS = {
  E_VERB:   { row: 0, col: 0, length: 1 },
  SAO:      { row: 0, col: 2, length: 3 },
  DUAS:     { row: 0, col: 5, length: 4 },
  UMA:      { row: 1, col: 0, length: 3 },
  DOZE:     { row: 1, col: 3, length: 4 },
  ONZE:     { row: 1, col: 7, length: 4 },
  QUATRO:   { row: 2, col: 0, length: 6 },
  CINCO_H:  { row: 2, col: 6, length: 5 },
  SEIS:     { row: 3, col: 0, length: 4 },
  SETE:     { row: 3, col: 4, length: 4 },
  OITO:     { row: 4, col: 0, length: 4 },
  NOVE:     { row: 4, col: 4, length: 4 },
  TRES:     { row: 5, col: 0, length: 4 },
  DEZ_H:    { row: 5, col: 4, length: 3 },
  E_CONJ:   { row: 6, col: 0, length: 1 },
  MENOS:    { row: 6, col: 1, length: 5 },
  VINTE:    { row: 6, col: 6, length: 5 },
  CINCO_M:  { row: 7, col: 0, length: 5 },
  DEZ_M:    { row: 7, col: 5, length: 3 },
  QUARTO:   { row: 8, col: 0, length: 6 },
  MEIA:     { row: 8, col: 6, length: 4 },
};

function pt_getHourWord(h) {
  const hour12 = ((h % 12) || 12);
  const map = {
    1: 'UMA', 2: 'DUAS', 3: 'TRES', 4: 'QUATRO',
    5: 'CINCO_H', 6: 'SEIS', 7: 'SETE', 8: 'OITO',
    9: 'NOVE', 10: 'DEZ_H', 11: 'ONZE', 12: 'DOZE',
  };
  return map[hour12];
}

function pt_timeToWords(hours, minutes) {
  const min5 = Math.floor(minutes / 5) * 5;

  let displayHour = hours;

  if (min5 >= 35) {
    displayHour = hours + 1;
  }

  const h12 = ((displayHour % 12) || 12);

  const words = h12 === 1 ? ['E_VERB'] : ['SAO'];
  const hourWord = pt_getHourWord(displayHour);

  words.push(hourWord);

  switch (min5) {
    case 0:
      break;
    case 5:
      words.push('E_CONJ', 'CINCO_M');
      break;
    case 10:
      words.push('E_CONJ', 'DEZ_M');
      break;
    case 15:
      words.push('E_CONJ', 'QUARTO');
      break;
    case 20:
      words.push('E_CONJ', 'VINTE');
      break;
    case 25:
      words.push('E_CONJ', 'VINTE', 'CINCO_M');
      break;
    case 30:
      words.push('E_CONJ', 'MEIA');
      break;
    case 35:
      words.push('MENOS', 'VINTE', 'CINCO_M');
      break;
    case 40:
      words.push('MENOS', 'VINTE');
      break;
    case 45:
      words.push('MENOS', 'QUARTO');
      break;
    case 50:
      words.push('MENOS', 'DEZ_M');
      break;
    case 55:
      words.push('MENOS', 'CINCO_M');
      break;
  }

  return words;
}

export const localePt = {
  GRID: pt_GRID,
  WORDS: pt_WORDS,
  LOCALE_NAME: 'Português',
  MINUTE_LABEL: 'MINUTOS',
  MINUTE_LABEL_SINGULAR: 'MINUTO',
  timeToWords: pt_timeToWords,
};
