// Japanese word clock layout - 10 rows x 11 columns

const ja_GRID = [
  ['今', '一', '二', '三', '四', '五', '六', '七', '八', '九', '暦'],
  ['十', '一', '十', '二', '時', '丁', '度', '半', '朝', '昼', '夕'],
  ['二', '三', '四', '五', '十', '五', '分', '春', '夏', '秋', '冬'],
  ['花', '鳥', '山', '川', '海', '空', '森', '林', '田', '畑', '道'],
  ['石', '岩', '砂', '土', '金', '銀', '銅', '鉄', '玉', '珠', '宝'],
  ['赤', '青', '白', '黒', '緑', '黄', '紫', '橙', '茶', '灰', '桃'],
  ['日', '光', '影', '闇', '炎', '水', '氷', '煙', '霞', '靄', '霧'],
  ['音', '声', '歌', '舞', '詩', '画', '書', '琴', '笛', '鼓', '鈴'],
  ['雨', '雷', '雲', '霧', '霜', '露', '虹', '月', '星', '雪', '風'],
  ['和', '正', '刻', '秒', '夜', '明', '前', '後', '午', '度', '丁'],
];

const ja_WORDS = {
  IMA:     { row: 0, col: 0, length: 1 },
  ICHI:    { row: 0, col: 1, length: 1 },
  NI_H:    { row: 0, col: 2, length: 1 },
  SAN_H:   { row: 0, col: 3, length: 1 },
  YON:     { row: 0, col: 4, length: 1 },
  GO_H:    { row: 0, col: 5, length: 1 },
  ROKU:    { row: 0, col: 6, length: 1 },
  NANA:    { row: 0, col: 7, length: 1 },
  HACHI:   { row: 0, col: 8, length: 1 },
  KU:      { row: 0, col: 9, length: 1 },
  JUU_H:   { row: 1, col: 0, length: 1 },
  JUUICHI: { row: 1, col: 0, length: 2 },
  JUUNI:   { row: 1, col: 2, length: 2 },
  JI:      { row: 1, col: 4, length: 1 },
  CHOUDO:  { row: 1, col: 5, length: 2 },
  HAN:     { row: 1, col: 7, length: 1 },
  NI_M:    { row: 2, col: 0, length: 1 },
  SAN_M:   { row: 2, col: 1, length: 1 },
  YON_M:   { row: 2, col: 2, length: 1 },
  GO_M2:   { row: 2, col: 3, length: 1 },
  JUU_M:   { row: 2, col: 4, length: 1 },
  GO_M1:   { row: 2, col: 5, length: 1 },
  FUN:     { row: 2, col: 6, length: 1 },
};

function ja_getHourWord(h) {
  const hour12 = ((h % 12) || 12);
  const map = {
    1: 'ICHI', 2: 'NI_H', 3: 'SAN_H', 4: 'YON',
    5: 'GO_H', 6: 'ROKU', 7: 'NANA', 8: 'HACHI',
    9: 'KU', 10: 'JUU_H', 11: 'JUUICHI', 12: 'JUUNI',
  };
  return map[hour12];
}

function ja_timeToWords(hours, minutes) {
  const min5 = Math.floor(minutes / 5) * 5;
  const h12 = ((hours % 12) || 12);

  const words = ['IMA'];
  const hourWord = ja_getHourWord(h12);
  words.push(hourWord, 'JI');

  switch (min5) {
    case 0:
      words.push('CHOUDO');
      break;
    case 5:
      words.push('GO_M1', 'FUN');
      break;
    case 10:
      words.push('JUU_M', 'FUN');
      break;
    case 15:
      words.push('JUU_M', 'GO_M1', 'FUN');
      break;
    case 20:
      words.push('NI_M', 'JUU_M', 'FUN');
      break;
    case 25:
      words.push('NI_M', 'JUU_M', 'GO_M1', 'FUN');
      break;
    case 30:
      words.push('HAN');
      break;
    case 35:
      words.push('SAN_M', 'JUU_M', 'GO_M1', 'FUN');
      break;
    case 40:
      words.push('YON_M', 'JUU_M', 'FUN');
      break;
    case 45:
      words.push('YON_M', 'JUU_M', 'GO_M1', 'FUN');
      break;
    case 50:
      words.push('GO_M2', 'JUU_M', 'FUN');
      break;
    case 55:
      words.push('GO_M2', 'JUU_M', 'GO_M1', 'FUN');
      break;
  }

  return words;
}

export const localeJa = {
  GRID: ja_GRID,
  WORDS: ja_WORDS,
  LOCALE_NAME: '日本語',
  MINUTE_LABEL: '分',
  MINUTE_LABEL_SINGULAR: '分',
  timeToWords: ja_timeToWords,
};
