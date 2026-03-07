/**
 * DOM rendering for the word clock grid.
 */

let gridContainer = null;
let cells = []; // 2D array of cell elements
let minuteCells = []; // [plus, 1, 2, 3, 4, label]

export function buildGrid(locale, container) {
  gridContainer = container;
  gridContainer.innerHTML = '';
  cells = [];
  minuteCells = [];

  const grid = locale.GRID;
  const table = document.createElement('div');
  table.className = 'clock-grid';
  table.setAttribute('role', 'img');
  table.setAttribute('aria-label', 'Word Clock');

  for (let r = 0; r < grid.length; r++) {
    const rowEl = document.createElement('div');
    rowEl.className = 'clock-row';
    cells[r] = [];

    for (let c = 0; c < grid[r].length; c++) {
      const cell = document.createElement('span');
      cell.className = 'clock-letter';
      cell.textContent = grid[r][c];
      cell.dataset.row = r;
      cell.dataset.col = c;
      rowEl.appendChild(cell);
      cells[r][c] = cell;
    }

    table.appendChild(rowEl);
  }

  // Minute indicator row: + 1 2 3 4 MINUTEN
  const minuteRow = document.createElement('div');
  minuteRow.className = 'clock-row minute-row';

  const parts = ['+', '1', '2', '3', '4', locale.MINUTE_LABEL];
  for (const text of parts) {
    const cell = document.createElement('span');
    cell.className = 'clock-letter minute-indicator';
    cell.textContent = text;
    minuteRow.appendChild(cell);
    minuteCells.push(cell);
  }

  table.appendChild(minuteRow);
  gridContainer.appendChild(table);
}

export function highlightWords(wordKeys, locale, extraMinutes) {
  if (!cells.length) return;

  // Clear all active
  for (const row of cells) {
    for (const cell of row) {
      cell.classList.remove('active');
    }
  }

  // Highlight active words
  for (const key of wordKeys) {
    const word = locale.WORDS[key];
    if (!word) continue;
    for (let i = 0; i < word.length; i++) {
      if (cells[word.row] && cells[word.row][word.col + i]) {
        cells[word.row][word.col + i].classList.add('active');
      }
    }
  }

  // Highlight minute indicators
  // minuteCells: [+, 1, 2, 3, 4, LABEL]
  for (const cell of minuteCells) {
    cell.classList.remove('active');
  }

  if (extraMinutes > 0 && minuteCells.length === 6) {
    minuteCells[0].classList.add('active');            // +
    minuteCells[extraMinutes].classList.add('active');  // the single digit (1-4)
    minuteCells[5].textContent = extraMinutes === 1
      ? (locale.MINUTE_LABEL_SINGULAR || locale.MINUTE_LABEL)
      : locale.MINUTE_LABEL;
    minuteCells[5].classList.add('active');             // MINUTEN/MINUTES
  }
}
