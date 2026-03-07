// Chinese (Mandarin) word clock layout - 10 rows x 11 columns

const zh_GRID = [
  ['现', '在', '是', '下', '午', '上', '早', '时', '钟', '中', '文'],
  ['一', '二', '三', '四', '五', '六', '七', '八', '九', '字', '表'],
  ['十', '一', '盘', '十', '二', '面', '光', '亮', '暗', '明', '清'],
  ['点', '整', '半', '晨', '夜', '日', '月', '年', '花', '开', '落'],
  ['二', '三', '四', '五', '春', '秋', '冬', '风', '雨', '雪', '霜'],
  ['十', '五', '分', '露', '雷', '电', '云', '雾', '霞', '虹', '山'],
  ['水', '木', '火', '土', '金', '银', '铜', '铁', '锡', '铅', '东'],
  ['南', '西', '北', '左', '右', '前', '后', '高', '低', '天', '地'],
  ['人', '和', '平', '安', '乐', '福', '禄', '寿', '喜', '诗', '书'],
  ['画', '琴', '棋', '茶', '酒', '歌', '舞', '梦', '缘', '星', '河'],
];

const zh_WORDS = {
  XIANZAI:  { row: 0, col: 0, length: 2 },
  YI:       { row: 1, col: 0, length: 1 },
  ER_H:     { row: 1, col: 1, length: 1 },
  SAN_H:    { row: 1, col: 2, length: 1 },
  SI_H:     { row: 1, col: 3, length: 1 },
  WU_H:     { row: 1, col: 4, length: 1 },
  LIU:      { row: 1, col: 5, length: 1 },
  QI:       { row: 1, col: 6, length: 1 },
  BA:       { row: 1, col: 7, length: 1 },
  JIU:      { row: 1, col: 8, length: 1 },
  SHI_H:    { row: 2, col: 0, length: 1 },
  SHIYI:    { row: 2, col: 0, length: 2 },
  SHIER:    { row: 2, col: 3, length: 2 },
  DIAN:     { row: 3, col: 0, length: 1 },
  ZHENG:    { row: 3, col: 1, length: 1 },
  BAN:      { row: 3, col: 2, length: 1 },
  ER_M:     { row: 4, col: 0, length: 1 },
  SAN_M:    { row: 4, col: 1, length: 1 },
  SI_M:     { row: 4, col: 2, length: 1 },
  WU_M2:    { row: 4, col: 3, length: 1 },
  SHI_M:    { row: 5, col: 0, length: 1 },
  WU_M1:    { row: 5, col: 1, length: 1 },
  FEN:      { row: 5, col: 2, length: 1 },
};

function zh_getHourWord(h) {
  const hour12 = ((h % 12) || 12);
  const map = {
    1: 'YI', 2: 'ER_H', 3: 'SAN_H', 4: 'SI_H',
    5: 'WU_H', 6: 'LIU', 7: 'QI', 8: 'BA',
    9: 'JIU', 10: 'SHI_H', 11: 'SHIYI', 12: 'SHIER',
  };
  return map[hour12];
}

function zh_timeToWords(hours, minutes) {
  const min5 = Math.floor(minutes / 5) * 5;

  const displayHour = ((hours % 12) || 12);

  const words = ['XIANZAI'];
  const hourWord = zh_getHourWord(displayHour);

  words.push(hourWord, 'DIAN');

  switch (min5) {
    case 0:
      words.push('ZHENG');
      break;
    case 5:
      words.push('WU_M1', 'FEN');
      break;
    case 10:
      words.push('SHI_M', 'FEN');
      break;
    case 15:
      words.push('SHI_M', 'WU_M1', 'FEN');
      break;
    case 20:
      words.push('ER_M', 'SHI_M', 'FEN');
      break;
    case 25:
      words.push('ER_M', 'SHI_M', 'WU_M1', 'FEN');
      break;
    case 30:
      words.push('BAN');
      break;
    case 35:
      words.push('SAN_M', 'SHI_M', 'WU_M1', 'FEN');
      break;
    case 40:
      words.push('SI_M', 'SHI_M', 'FEN');
      break;
    case 45:
      words.push('SI_M', 'SHI_M', 'WU_M1', 'FEN');
      break;
    case 50:
      words.push('WU_M2', 'SHI_M', 'FEN');
      break;
    case 55:
      words.push('WU_M2', 'SHI_M', 'WU_M1', 'FEN');
      break;
  }

  return words;
}

export const localeZh = {
  GRID: zh_GRID,
  WORDS: zh_WORDS,
  LOCALE_NAME: '中文',
  MINUTE_LABEL: '分钟',
  MINUTE_LABEL_SINGULAR: '分钟',
  timeToWords: zh_timeToWords,
};
