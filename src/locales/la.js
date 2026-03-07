// Latin word clock layout - 10 rows x 11 columns

const la_GRID = [
  ['H', 'O', 'R', 'A', 'V', 'I', 'G', 'I', 'N', 'T', 'I'],
  ['E', 'S', 'T', 'D', 'E', 'C', 'E', 'M', 'E', 'T', 'X'],
  ['Q', 'U', 'A', 'R', 'T', 'A', 'N', 'O', 'V', 'E', 'M'],
  ['D', 'I', 'M', 'I', 'D', 'I', 'A', 'A', 'N', 'T', 'E'],
  ['Q', 'U', 'I', 'N', 'Q', 'U', 'E', 'D', 'U', 'A', 'E'],
  ['U', 'N', 'A', 'Q', 'U', 'A', 'T', 'T', 'U', 'O', 'R'],
  ['T', 'R', 'E', 'S', 'Q', 'U', 'I', 'N', 'Q', 'U', 'E'],
  ['S', 'E', 'X', 'D', 'U', 'O', 'D', 'E', 'C', 'I', 'M'],
  ['S', 'E', 'P', 'T', 'E', 'M', 'D', 'E', 'C', 'E', 'M'],
  ['O', 'C', 'T', 'O', 'U', 'N', 'D', 'E', 'C', 'I', 'M'],
];

const la_WORDS = {
  HORA:       { row: 0, col: 0, length: 4 },
  EST:        { row: 1, col: 0, length: 3 },
  QUINQUE_M:  { row: 4, col: 0, length: 7 },
  DECEM_M:    { row: 1, col: 3, length: 5 },
  QUARTA:     { row: 2, col: 0, length: 6 },
  VIGINTI:    { row: 0, col: 4, length: 7 },
  DIMIDIA:    { row: 3, col: 0, length: 7 },
  ET:         { row: 1, col: 8, length: 2 },
  ANTE:       { row: 3, col: 7, length: 4 },
  UNA:        { row: 5, col: 0, length: 3 },
  DUAE:       { row: 4, col: 7, length: 4 },
  TRES:       { row: 6, col: 0, length: 4 },
  QUATTUOR:   { row: 5, col: 3, length: 8 },
  QUINQUE_H:  { row: 6, col: 4, length: 7 },
  SEX:        { row: 7, col: 0, length: 3 },
  SEPTEM:     { row: 8, col: 0, length: 6 },
  OCTO:       { row: 9, col: 0, length: 4 },
  NOVEM:      { row: 2, col: 6, length: 5 },
  DECEM_H:    { row: 8, col: 6, length: 5 },
  UNDECIM:    { row: 9, col: 4, length: 7 },
  DUODECIM:   { row: 7, col: 3, length: 8 },
};

function la_getHourWord(h) {
  const hour12 = ((h % 12) || 12);
  const map = {
    1: 'UNA', 2: 'DUAE', 3: 'TRES', 4: 'QUATTUOR',
    5: 'QUINQUE_H', 6: 'SEX', 7: 'SEPTEM', 8: 'OCTO',
    9: 'NOVEM', 10: 'DECEM_H', 11: 'UNDECIM', 12: 'DUODECIM',
  };
  return map[hour12];
}

function la_timeToWords(hours, minutes) {
  const min5 = Math.floor(minutes / 5) * 5;

  let displayHour = hours;

  if (min5 >= 35) {
    displayHour = hours + 1;
  }

  displayHour = ((displayHour % 12) || 12);

  const words = ['HORA', 'EST'];
  const hourWord = la_getHourWord(displayHour);

  switch (min5) {
    case 0:
      words.push(hourWord);
      break;
    case 5:
      words.push('QUINQUE_M', 'ET', la_getHourWord(hours));
      break;
    case 10:
      words.push('DECEM_M', 'ET', la_getHourWord(hours));
      break;
    case 15:
      words.push('QUARTA', 'ET', la_getHourWord(hours));
      break;
    case 20:
      words.push('VIGINTI', 'ET', la_getHourWord(hours));
      break;
    case 25:
      words.push('VIGINTI', 'QUINQUE_M', 'ET', la_getHourWord(hours));
      break;
    case 30:
      words.push('DIMIDIA', 'ET', la_getHourWord(hours));
      break;
    case 35:
      words.push('VIGINTI', 'QUINQUE_M', 'ANTE', hourWord);
      break;
    case 40:
      words.push('VIGINTI', 'ANTE', hourWord);
      break;
    case 45:
      words.push('QUARTA', 'ANTE', hourWord);
      break;
    case 50:
      words.push('DECEM_M', 'ANTE', hourWord);
      break;
    case 55:
      words.push('QUINQUE_M', 'ANTE', hourWord);
      break;
  }

  words.sort((a, b) => {
    const wa = la_WORDS[a];
    const wb = la_WORDS[b];
    return (wa.row * 11 + wa.col) - (wb.row * 11 + wb.col);
  });

  return words;
}

export const localeLa = {
  GRID: la_GRID,
  WORDS: la_WORDS,
  LOCALE_NAME: 'Latina',
  MINUTE_LABEL: 'MINUTAE',
  MINUTE_LABEL_SINGULAR: 'MINUTA',
  timeToWords: la_timeToWords,
};
