// Russian word clock layout - 10 rows x 11 columns

const ru_GRID = [
  ['Б', 'Е', 'З', 'П', 'О', 'Л', 'О', 'В', 'И', 'Н', 'А'],
  ['Ч', 'Е', 'Т', 'В', 'Е', 'Р', 'Т', 'Ь', 'Ч', 'А', 'С'],
  ['Д', 'В', 'А', 'Д', 'Ц', 'А', 'Т', 'Ь', 'Г', 'Д', 'Ж'],
  ['Д', 'Е', 'С', 'Я', 'Т', 'Ь', 'П', 'Я', 'Т', 'Ь', 'Т'],
  ['О', 'Д', 'И', 'Н', 'Н', 'А', 'Д', 'Ц', 'А', 'Т', 'Ь'],
  ['Д', 'В', 'Е', 'Н', 'А', 'Д', 'Ц', 'А', 'Т', 'Ь', 'Н'],
  ['Ч', 'Е', 'Т', 'Ы', 'Р', 'Е', 'Ш', 'Е', 'С', 'Т', 'Ь'],
  ['В', 'О', 'С', 'Е', 'М', 'Ь', 'П', 'Я', 'Т', 'Ь', 'З'],
  ['Д', 'Е', 'С', 'Я', 'Т', 'Ь', 'Д', 'В', 'А', 'Т', 'У'],
  ['Д', 'Е', 'В', 'Я', 'Т', 'Ь', 'Т', 'Р', 'И', 'А', 'Б'],
];

const ru_WORDS = {
  BEZ:        { row: 0, col: 0, length: 3 },
  POLOVINA:   { row: 0, col: 3, length: 8 },
  CHETVERT:   { row: 1, col: 0, length: 8 },
  CHAS:       { row: 1, col: 8, length: 3 },
  DVADCAT:    { row: 2, col: 0, length: 8 },
  DESYAT_M:   { row: 3, col: 0, length: 6 },
  PYAT_M:     { row: 3, col: 6, length: 4 },
  ODINNADCAT: { row: 4, col: 0, length: 11 },
  ODIN:       { row: 4, col: 0, length: 4 },
  DVENADCAT:  { row: 5, col: 0, length: 10 },
  CHETYRE:    { row: 6, col: 0, length: 6 },
  SHEST:      { row: 6, col: 6, length: 5 },
  VOSEM:      { row: 7, col: 0, length: 6 },
  SEM:        { row: 7, col: 2, length: 4 },
  PYAT_H:     { row: 7, col: 6, length: 4 },
  DESYAT_H:   { row: 8, col: 0, length: 6 },
  DVA:        { row: 8, col: 6, length: 3 },
  DEVYAT:     { row: 9, col: 0, length: 6 },
  TRI:        { row: 9, col: 6, length: 3 },
};

function ru_getHourWord(h) {
  const hour12 = ((h % 12) || 12);
  const map = {
    1: 'ODIN', 2: 'DVA', 3: 'TRI', 4: 'CHETYRE',
    5: 'PYAT_H', 6: 'SHEST', 7: 'SEM', 8: 'VOSEM',
    9: 'DEVYAT', 10: 'DESYAT_H', 11: 'ODINNADCAT', 12: 'DVENADCAT',
  };
  return map[hour12];
}

function ru_timeToWords(hours, minutes) {
  const min5 = Math.floor(minutes / 5) * 5;

  let displayHour = hours;

  if (min5 >= 35) {
    displayHour = hours + 1;
  }

  displayHour = ((displayHour % 12) || 12);

  const words = [];
  const hourWord = ru_getHourWord(displayHour);

  switch (min5) {
    case 0:
      words.push('CHAS', ru_getHourWord(hours));
      break;
    case 5:
      words.push('PYAT_M', ru_getHourWord(hours));
      break;
    case 10:
      words.push('DESYAT_M', ru_getHourWord(hours));
      break;
    case 15:
      words.push('CHETVERT', ru_getHourWord(hours));
      break;
    case 20:
      words.push('DVADCAT', ru_getHourWord(hours));
      break;
    case 25:
      words.push('DVADCAT', 'PYAT_M', ru_getHourWord(hours));
      break;
    case 30:
      words.push('POLOVINA', ru_getHourWord(hours));
      break;
    case 35:
      words.push('BEZ', 'DVADCAT', 'PYAT_M', hourWord);
      break;
    case 40:
      words.push('BEZ', 'DVADCAT', hourWord);
      break;
    case 45:
      words.push('BEZ', 'CHETVERT', hourWord);
      break;
    case 50:
      words.push('BEZ', 'DESYAT_M', hourWord);
      break;
    case 55:
      words.push('BEZ', 'PYAT_M', hourWord);
      break;
  }

  return words;
}

export const localeRu = {
  GRID: ru_GRID,
  WORDS: ru_WORDS,
  LOCALE_NAME: 'Русский',
  MINUTE_LABEL: 'МИНУТ',
  MINUTE_LABEL_SINGULAR: 'МИНУТА',
  timeToWords: ru_timeToWords,
};
