// Italian word clock layout - 10 rows x 11 columns

const it_GRID = [
  ['S', 'O', 'N', 'O', 'L', 'E', 'D', 'U', 'E', 'G', 'B'],
  ['E', 'L', 'U', 'N', 'A', 'T', 'R', 'E', 'H', 'K', 'W'],
  ['Q', 'U', 'A', 'T', 'T', 'R', 'O', 'S', 'E', 'I', 'X'],
  ['C', 'I', 'N', 'Q', 'U', 'E', 'O', 'T', 'T', 'O', 'P'],
  ['N', 'O', 'V', 'E', 'S', 'E', 'T', 'T', 'E', 'D', 'M'],
  ['D', 'I', 'E', 'C', 'I', 'U', 'N', 'D', 'I', 'C', 'I'],
  ['D', 'O', 'D', 'I', 'C', 'I', 'M', 'E', 'N', 'O', 'R'],
  ['E', 'Q', 'U', 'A', 'R', 'T', 'O', 'V', 'J', 'X', 'F'],
  ['E', 'V', 'E', 'N', 'T', 'I', 'D', 'I', 'E', 'C', 'I'],
  ['M', 'E', 'Z', 'Z', 'A', 'C', 'I', 'N', 'Q', 'U', 'E'],
];

const it_WORDS = {
  SONO:     { row: 0, col: 0, length: 4 },
  LE:       { row: 0, col: 4, length: 2 },
  DUE:      { row: 0, col: 6, length: 3 },
  E_VERB:   { row: 1, col: 0, length: 1 },
  L:        { row: 1, col: 1, length: 1 },
  UNA:      { row: 1, col: 2, length: 3 },
  TRE:      { row: 1, col: 5, length: 3 },
  QUATTRO:  { row: 2, col: 0, length: 7 },
  SEI:      { row: 2, col: 7, length: 3 },
  CINQUE_H: { row: 3, col: 0, length: 6 },
  OTTO:     { row: 3, col: 6, length: 4 },
  NOVE:     { row: 4, col: 0, length: 4 },
  SETTE:    { row: 4, col: 4, length: 5 },
  DIECI_H:  { row: 5, col: 0, length: 5 },
  UNDICI:   { row: 5, col: 5, length: 6 },
  DODICI:   { row: 6, col: 0, length: 6 },
  MENO:     { row: 6, col: 6, length: 4 },
  E_CONJ:   { row: 7, col: 0, length: 1 },
  QUARTO:   { row: 7, col: 1, length: 6 },
  VENTI:    { row: 8, col: 1, length: 5 },
  DIECI_M:  { row: 8, col: 6, length: 5 },
  MEZZA:    { row: 9, col: 0, length: 5 },
  CINQUE_M: { row: 9, col: 5, length: 6 },
};

function it_getHourWord(h) {
  const hour12 = ((h % 12) || 12);
  const map = {
    1: 'UNA', 2: 'DUE', 3: 'TRE', 4: 'QUATTRO',
    5: 'CINQUE_H', 6: 'SEI', 7: 'SETTE', 8: 'OTTO',
    9: 'NOVE', 10: 'DIECI_H', 11: 'UNDICI', 12: 'DODICI',
  };
  return map[hour12];
}

function it_timeToWords(hours, minutes) {
  const min5 = Math.floor(minutes / 5) * 5;

  let displayHour = hours;

  if (min5 >= 35) {
    displayHour = hours + 1;
  }

  displayHour = ((displayHour % 12) || 12);

  const hourWord = it_getHourWord(displayHour);
  const words = displayHour === 1 ? ['E_VERB', 'L'] : ['SONO', 'LE'];

  words.push(hourWord);

  switch (min5) {
    case 0:
      break;
    case 5:
      words.push('E_CONJ', 'CINQUE_M');
      break;
    case 10:
      words.push('E_CONJ', 'DIECI_M');
      break;
    case 15:
      words.push('E_CONJ', 'QUARTO');
      break;
    case 20:
      words.push('E_CONJ', 'VENTI');
      break;
    case 25:
      words.push('E_CONJ', 'VENTI', 'CINQUE_M');
      break;
    case 30:
      words.push('E_CONJ', 'MEZZA');
      break;
    case 35:
      words.push('MENO', 'VENTI', 'CINQUE_M');
      break;
    case 40:
      words.push('MENO', 'VENTI');
      break;
    case 45:
      words.push('MENO', 'QUARTO');
      break;
    case 50:
      words.push('MENO', 'DIECI_M');
      break;
    case 55:
      words.push('MENO', 'CINQUE_M');
      break;
  }

  return words;
}

export const localeIt = {
  GRID: it_GRID,
  WORDS: it_WORDS,
  LOCALE_NAME: 'Italiano',
  MINUTE_LABEL: 'MINUTI',
  MINUTE_LABEL_SINGULAR: 'MINUTO',
  timeToWords: it_timeToWords,
};
