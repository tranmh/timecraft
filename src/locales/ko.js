// Korean word clock layout - 10 rows x 11 columns

const ko_GRID = [
  ['지', '금', '가', '나', '다', '라', '마', '바', '사', '자', '차'],
  ['한', '두', '세', '네', '열', '다', '섯', '카', '타', '파', '하'],
  ['여', '섯', '일', '곱', '여', '덟', '아', '홉', '거', '너', '더'],
  ['열', '한', '열', '두', '시', '러', '머', '버', '서', '어', '저'],
  ['이', '삼', '사', '오', '십', '오', '분', '반', '정', '각', '처'],
  ['커', '터', '퍼', '허', '고', '노', '도', '로', '모', '보', '소'],
  ['조', '초', '코', '토', '포', '호', '구', '누', '두', '루', '무'],
  ['부', '수', '우', '주', '추', '쿠', '투', '푸', '후', '그', '느'],
  ['드', '르', '므', '브', '스', '으', '즈', '크', '트', '프', '흐'],
  ['감', '남', '담', '람', '맘', '밤', '삼', '참', '감', '남', '담'],
];

const ko_WORDS = {
  JIGEUM:   { row: 0, col: 0, length: 2 },

  HAN:      { row: 1, col: 0, length: 1 },
  DU:       { row: 1, col: 1, length: 1 },
  SE:       { row: 1, col: 2, length: 1 },
  NE:       { row: 1, col: 3, length: 1 },
  YEOL:     { row: 1, col: 4, length: 1 },
  DASEOT:   { row: 1, col: 5, length: 2 },
  YEOSEOT:  { row: 2, col: 0, length: 2 },
  ILGOP:    { row: 2, col: 2, length: 2 },
  YEODEOL:  { row: 2, col: 4, length: 2 },
  AHOP:     { row: 2, col: 6, length: 2 },
  YEOLHAN:  { row: 3, col: 0, length: 2 },
  YEOLDU:   { row: 3, col: 2, length: 2 },

  SI:       { row: 3, col: 4, length: 1 },

  I_M:      { row: 4, col: 0, length: 1 },
  SAM_M:    { row: 4, col: 1, length: 1 },
  SA_M:     { row: 4, col: 2, length: 1 },
  O_M2:     { row: 4, col: 3, length: 1 },
  SIP_M:    { row: 4, col: 4, length: 1 },
  O_M1:     { row: 4, col: 5, length: 1 },
  BUN:      { row: 4, col: 6, length: 1 },
  BAN:      { row: 4, col: 7, length: 1 },
  JEONGGAK: { row: 4, col: 8, length: 2 },
};

function ko_getHourWord(h) {
  const hour12 = ((h % 12) || 12);
  const map = {
    1: 'HAN', 2: 'DU', 3: 'SE', 4: 'NE',
    5: 'DASEOT', 6: 'YEOSEOT', 7: 'ILGOP', 8: 'YEODEOL',
    9: 'AHOP', 10: 'YEOL', 11: 'YEOLHAN', 12: 'YEOLDU',
  };
  return map[hour12];
}

function ko_timeToWords(hours, minutes) {
  const min5 = Math.floor(minutes / 5) * 5;

  const h12 = ((hours % 12) || 12);

  const words = ['JIGEUM'];
  const hourWord = ko_getHourWord(h12);

  words.push(hourWord, 'SI');

  switch (min5) {
    case 0:
      words.push('JEONGGAK');
      break;
    case 5:
      words.push('O_M1', 'BUN');
      break;
    case 10:
      words.push('SIP_M', 'BUN');
      break;
    case 15:
      words.push('SIP_M', 'O_M1', 'BUN');
      break;
    case 20:
      words.push('I_M', 'SIP_M', 'BUN');
      break;
    case 25:
      words.push('I_M', 'SIP_M', 'O_M1', 'BUN');
      break;
    case 30:
      words.push('BAN');
      break;
    case 35:
      words.push('SAM_M', 'SIP_M', 'O_M1', 'BUN');
      break;
    case 40:
      words.push('SA_M', 'SIP_M', 'BUN');
      break;
    case 45:
      words.push('SA_M', 'SIP_M', 'O_M1', 'BUN');
      break;
    case 50:
      words.push('O_M2', 'SIP_M', 'BUN');
      break;
    case 55:
      words.push('O_M2', 'SIP_M', 'O_M1', 'BUN');
      break;
  }

  return words;
}

export const localeKo = {
  GRID: ko_GRID,
  WORDS: ko_WORDS,
  LOCALE_NAME: '한국어',
  MINUTE_LABEL: '분',
  MINUTE_LABEL_SINGULAR: '분',
  timeToWords: ko_timeToWords,
};
