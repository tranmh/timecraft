// Vietnamese word clock layout - 10 rows x 11 columns

const vi_GRID = [
  ['M', '\u01AF', '\u1EDC', 'I', 'M', '\u1ED8', 'T', 'B', '\u1ED0', 'N', 'W'],  // Row 0: MƯỜI_H(0-3) MỘT(4-6) BỐN(7-9)
  ['H', 'A', 'I', 'B', 'A', 'S', '\u00C1', 'U', 'B', '\u1EA2', 'Y'],            // Row 1: HAI_H(0-2) BA(3-4) SÁU(5-7) BẢY(8-10)
  ['T', '\u00C1', 'M', 'N', '\u0102', 'M', 'C', 'H', '\u00CD', 'N', 'X'],        // Row 2: TÁM(0-2) NĂM_H(3-5) CHÍN(6-9)
  ['G', 'I', '\u1EDC', 'K', '\u00C9', 'M', 'R', '\u01AF', '\u1EE0', 'I', 'Z'],   // Row 3: GIỜ(0-2) KÉM(3-5) RƯỠI(6-9)
  ['M', '\u01AF', '\u1EDC', 'I', 'H', 'A', 'I', 'N', '\u0102', 'M', 'P'],        // Row 4: MƯỜI_M(0-3) HAI_M(4-6) NĂM_M(7-9)
  ['M', '\u01AF', '\u01A0', 'I', 'L', '\u0102', 'M', 'D', 'V', 'G', 'L'],        // Row 5: MƯƠI(0-3) LĂM(4-6)
  ['X', 'Z', 'W', 'Y', 'B', 'D', 'H', 'T', 'N', 'R', 'S'],
  ['P', 'G', 'F', 'C', 'L', 'V', 'K', 'J', 'Q', 'X', 'Z'],
  ['D', 'B', 'H', 'R', 'T', 'N', 'S', 'G', 'L', 'V', 'W'],
  ['F', 'K', 'J', 'X', 'Z', 'P', 'Q', 'C', 'Y', 'M', 'D'],
];

const vi_WORDS = {
  MUOI_H:   { row: 0, col: 0, length: 4 },
  MOT:      { row: 0, col: 4, length: 3 },
  BON:      { row: 0, col: 7, length: 3 },
  HAI_H:    { row: 1, col: 0, length: 3 },
  BA:       { row: 1, col: 3, length: 2 },
  SAU:      { row: 1, col: 5, length: 3 },
  BAY:      { row: 1, col: 8, length: 3 },
  TAM:      { row: 2, col: 0, length: 3 },
  NAM_H:    { row: 2, col: 3, length: 3 },
  CHIN:     { row: 2, col: 6, length: 4 },
  GIO:      { row: 3, col: 0, length: 3 },
  KEM:      { row: 3, col: 3, length: 3 },
  RUOI:     { row: 3, col: 6, length: 4 },
  MUOI_M:   { row: 4, col: 0, length: 4 },
  HAI_M:    { row: 4, col: 4, length: 3 },
  NAM_M:    { row: 4, col: 7, length: 3 },
  MUOI_T:   { row: 5, col: 0, length: 4 },
  LAM:      { row: 5, col: 4, length: 3 },
};

function vi_getHourWords(h) {
  const hour12 = ((h % 12) || 12);
  const map = {
    1: ['MOT'], 2: ['HAI_H'], 3: ['BA'], 4: ['BON'],
    5: ['NAM_H'], 6: ['SAU'], 7: ['BAY'], 8: ['TAM'],
    9: ['CHIN'], 10: ['MUOI_H'], 11: ['MUOI_H', 'MOT'], 12: ['MUOI_H', 'HAI_H'],
  };
  return map[hour12];
}

function vi_timeToWords(hours, minutes) {
  const min5 = Math.floor(minutes / 5) * 5;

  let displayHour = hours;

  if (min5 >= 35) {
    displayHour = hours + 1;
  }

  displayHour = ((displayHour % 12) || 12);

  const words = [];
  const currentHourWords = vi_getHourWords(hours);
  const nextHourWords = vi_getHourWords(displayHour);

  switch (min5) {
    case 0:
      words.push(...currentHourWords, 'GIO');
      break;
    case 5:
      words.push(...currentHourWords, 'GIO', 'NAM_M');
      break;
    case 10:
      words.push(...currentHourWords, 'GIO', 'MUOI_M');
      break;
    case 15:
      words.push(...currentHourWords, 'GIO', 'MUOI_M', 'LAM');
      break;
    case 20:
      words.push(...currentHourWords, 'GIO', 'HAI_M', 'MUOI_T');
      break;
    case 25:
      words.push(...currentHourWords, 'GIO', 'HAI_M', 'MUOI_T', 'LAM');
      break;
    case 30:
      words.push(...currentHourWords, 'GIO', 'RUOI');
      break;
    case 35:
      words.push(...nextHourWords, 'GIO', 'KEM', 'HAI_M', 'MUOI_T', 'LAM');
      break;
    case 40:
      words.push(...nextHourWords, 'GIO', 'KEM', 'HAI_M', 'MUOI_T');
      break;
    case 45:
      words.push(...nextHourWords, 'GIO', 'KEM', 'MUOI_M', 'LAM');
      break;
    case 50:
      words.push(...nextHourWords, 'GIO', 'KEM', 'MUOI_M');
      break;
    case 55:
      words.push(...nextHourWords, 'GIO', 'KEM', 'NAM_M');
      break;
  }

  return words;
}

export const localeVi = {
  GRID: vi_GRID,
  WORDS: vi_WORDS,
  LOCALE_NAME: 'Ti\u1EBFng Vi\u1EC7t',
  MINUTE_LABEL: 'PH\u00DAT',
  MINUTE_LABEL_SINGULAR: 'PH\u00DAT',
  timeToWords: vi_timeToWords,
};
