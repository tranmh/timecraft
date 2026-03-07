// Arabic word clock layout (romanized) - 10 rows x 11 columns

const ar_GRID = [
  ['E', 'S', 'S', 'A', 'I', 'T', 'H', 'N', 'A', 'N', 'X'],
  ['W', 'A', 'H', 'I', 'D', 'T', 'H', 'A', 'L', 'A', 'X'],
  ['K', 'H', 'A', 'M', 'S', 'A', 'S', 'I', 'T', 'T', 'A'],
  ['A', 'R', 'B', 'A', 'T', 'H', 'A', 'M', 'A', 'N', 'X'],
  ['S', 'A', 'B', 'A', 'A', 'S', 'H', 'R', 'A', 'X', 'X'],
  ['T', 'I', 'S', 'A', 'A', 'H', 'A', 'D', 'X', 'X', 'X'],
  ['I', 'T', 'H', 'N', 'A', 'A', 'S', 'H', 'R', 'W', 'A'],
  ['I', 'L', 'L', 'A', 'R', 'U', 'B', 'N', 'I', 'S', 'F'],
  ['A', 'S', 'H', 'R', 'A', 'I', 'S', 'H', 'R', 'I', 'N'],
  ['K', 'H', 'A', 'M', 'S', 'A', 'X', 'X', 'X', 'X', 'X'],
];

const ar_WORDS = {
  ESSA:     { row: 0, col: 0, length: 4 },
  ITHNAN:   { row: 0, col: 4, length: 6 },
  WAHID:    { row: 1, col: 0, length: 5 },
  THALA:    { row: 1, col: 5, length: 5 },
  KHAMSA_H: { row: 2, col: 0, length: 6 },
  SITTA:    { row: 2, col: 6, length: 5 },
  ARBA:     { row: 3, col: 0, length: 4 },
  THAMAN:   { row: 3, col: 4, length: 6 },
  SABA:     { row: 4, col: 0, length: 4 },
  ASHRA_H:  { row: 4, col: 4, length: 5 },
  TISA:     { row: 5, col: 0, length: 4 },
  AHAD:     { row: 5, col: 4, length: 4 },
  ITHNA:    { row: 6, col: 0, length: 5 },
  ASHR:     { row: 6, col: 5, length: 4 },
  WA:       { row: 6, col: 9, length: 2 },
  ILLA:     { row: 7, col: 0, length: 4 },
  RUB:      { row: 7, col: 4, length: 3 },
  NISF:     { row: 7, col: 7, length: 4 },
  ASHRA_M:  { row: 8, col: 0, length: 5 },
  ISHRIN:   { row: 8, col: 5, length: 6 },
  KHAMSA_M: { row: 9, col: 0, length: 6 },
};

function ar_getHourWords(h) {
  const hour12 = ((h % 12) || 12);
  const map = {
    1: ['WAHID'], 2: ['ITHNAN'], 3: ['THALA'], 4: ['ARBA'],
    5: ['KHAMSA_H'], 6: ['SITTA'], 7: ['SABA'], 8: ['THAMAN'],
    9: ['TISA'], 10: ['ASHRA_H'], 11: ['AHAD', 'ASHR'], 12: ['ITHNA', 'ASHR'],
  };
  return map[hour12];
}

function ar_timeToWords(hours, minutes) {
  const min5 = Math.floor(minutes / 5) * 5;

  let displayHour = hours;

  if (min5 >= 35) {
    displayHour = hours + 1;
  }

  const words = ['ESSA'];
  const currentHourWords = ar_getHourWords(hours);
  const nextHourWords = ar_getHourWords(displayHour);

  switch (min5) {
    case 0:
      words.push(...nextHourWords);
      break;
    case 5:
      words.push(...currentHourWords, 'WA', 'KHAMSA_M');
      break;
    case 10:
      words.push(...currentHourWords, 'WA', 'ASHRA_M');
      break;
    case 15:
      words.push(...currentHourWords, 'WA', 'RUB');
      break;
    case 20:
      words.push(...currentHourWords, 'WA', 'ISHRIN');
      break;
    case 25:
      words.push(...currentHourWords, 'WA', 'ISHRIN', 'KHAMSA_M');
      break;
    case 30:
      words.push(...currentHourWords, 'WA', 'NISF');
      break;
    case 35:
      words.push(...nextHourWords, 'ILLA', 'ISHRIN', 'KHAMSA_M');
      break;
    case 40:
      words.push(...nextHourWords, 'ILLA', 'ISHRIN');
      break;
    case 45:
      words.push(...nextHourWords, 'ILLA', 'RUB');
      break;
    case 50:
      words.push(...nextHourWords, 'ILLA', 'ASHRA_M');
      break;
    case 55:
      words.push(...nextHourWords, 'ILLA', 'KHAMSA_M');
      break;
  }

  return words;
}

export const localeAr = {
  GRID: ar_GRID,
  WORDS: ar_WORDS,
  LOCALE_NAME: '\u0627\u0644\u0639\u0631\u0628\u064A\u0629',
  MINUTE_LABEL: 'DAQAIQ',
  MINUTE_LABEL_SINGULAR: 'DAQIQA',
  timeToWords: ar_timeToWords,
};
