/**
 * DOM rendering for the word clock grid.
 */

let gridContainer = null;
let cells = []; // 2D array of cell elements
let minuteCells = []; // [plus, 1, 2, 3, 4, label]

// Effect state
let previousWordKeys = [];
let effects = { breathe: false, twinkle: false, matrix: false };
let twinkleInterval = null;
let breatheTimeout = null;
let matrixTimeout = null;

export function setEffect(name, enabled) {
  if (!(name in effects)) return;
  effects[name] = enabled;
  if (name === 'twinkle') {
    if (enabled) startTwinkle();
    else stopTwinkle();
  }
}

export function isEffectEnabled(name) {
  return effects[name] || false;
}

export function buildGrid(locale, container) {
  gridContainer = container;
  gridContainer.innerHTML = '';
  cells = [];
  minuteCells = [];
  previousWordKeys = [];

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

  // Restart twinkle if it was enabled
  if (effects.twinkle) {
    stopTwinkle();
    startTwinkle();
  }
}

export function highlightWords(wordKeys, locale, extraMinutes) {
  if (!cells.length) return;

  // Detect word key changes for effects
  const sorted = [...wordKeys].sort();
  const prevSorted = [...previousWordKeys].sort();
  const keysChanged = sorted.join(',') !== prevSorted.join(',');

  if (keysChanged && previousWordKeys.length > 0) {
    if (effects.breathe) triggerBreathe();
    if (effects.matrix) triggerMatrix();
  }
  previousWordKeys = [...wordKeys];

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

// --- Effect: Breathe (radial wave) ---

function distanceFromCenter(row, col) {
  if (!cells.length) return 0;
  const centerRow = (cells.length - 1) / 2;
  const centerCol = (cells[0].length - 1) / 2;
  return Math.sqrt((row - centerRow) ** 2 + (col - centerCol) ** 2);
}

function triggerBreathe() {
  if (!cells.length) return;
  if (breatheTimeout) clearTimeout(breatheTimeout);

  const maxDist = distanceFromCenter(0, 0);

  for (let r = 0; r < cells.length; r++) {
    for (let c = 0; c < cells[r].length; c++) {
      const cell = cells[r][c];
      const dist = distanceFromCenter(r, c);
      cell.style.transitionDelay = ((dist / maxDist) * 0.3) + 's';
      cell.classList.add('breathe-pulse');
    }
  }

  breatheTimeout = setTimeout(() => {
    for (const row of cells) {
      for (const cell of row) {
        cell.classList.remove('breathe-pulse');
      }
    }
    breatheTimeout = setTimeout(() => {
      for (const row of cells) {
        for (const cell of row) {
          cell.style.transitionDelay = '';
        }
      }
      breatheTimeout = null;
    }, 400);
  }, 500);
}

// --- Effect: Matrix (column cascade) ---

function triggerMatrix() {
  if (!cells.length) return;
  if (matrixTimeout) clearTimeout(matrixTimeout);

  for (let r = 0; r < cells.length; r++) {
    for (let c = 0; c < cells[r].length; c++) {
      const cell = cells[r][c];
      cell.style.transitionDelay = (r * 0.06 + c * 0.03) + 's';
      cell.classList.add('matrix-pulse');
    }
  }

  matrixTimeout = setTimeout(() => {
    for (const row of cells) {
      for (const cell of row) {
        cell.classList.remove('matrix-pulse');
      }
    }
    matrixTimeout = setTimeout(() => {
      for (const row of cells) {
        for (const cell of row) {
          cell.style.transitionDelay = '';
        }
      }
      matrixTimeout = null;
    }, 500);
  }, 800);
}

// --- Effect: Twinkle (random shimmer) ---

function startTwinkle() {
  if (twinkleInterval) return;
  twinkleInterval = setInterval(() => {
    if (!cells.length) return;

    // Count current twinkles
    const currentTwinkles = document.querySelectorAll('.clock-letter.twinkle');
    if (currentTwinkles.length >= 4) return;

    // Pick 1-2 random inactive cells
    const count = Math.random() < 0.5 ? 1 : 2;
    for (let i = 0; i < count; i++) {
      const r = Math.floor(Math.random() * cells.length);
      const c = Math.floor(Math.random() * cells[r].length);
      const cell = cells[r][c];
      if (cell.classList.contains('active') || cell.classList.contains('twinkle')) continue;
      cell.classList.add('twinkle');
      setTimeout(() => {
        cell.classList.remove('twinkle');
      }, 800);
    }
  }, 400);
}

function stopTwinkle() {
  if (twinkleInterval) {
    clearInterval(twinkleInterval);
    twinkleInterval = null;
  }
  // Remove any lingering twinkle classes
  const twinkles = document.querySelectorAll('.clock-letter.twinkle');
  for (const el of twinkles) {
    el.classList.remove('twinkle');
  }
}
