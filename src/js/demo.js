/**
 * Demo mode: manual time scrubber.
 */

let demoMode = false;
let demoHours = 12;
let demoMinutes = 0;
let onChange = null;

export function initDemo(container, callback) {
  onChange = callback;

  const controls = document.createElement('div');
  controls.className = 'demo-controls';
  controls.innerHTML = `
    <button class="demo-toggle" title="Toggle demo mode">Demo</button>
    <div class="demo-scrubber" style="display:none">
      <input type="range" min="0" max="1439" value="720" class="time-slider" aria-label="Time scrubber">
      <span class="demo-time-display">12:00</span>
    </div>
  `;
  container.appendChild(controls);

  const toggle = controls.querySelector('.demo-toggle');
  const scrubber = controls.querySelector('.demo-scrubber');
  const slider = controls.querySelector('.time-slider');
  const display = controls.querySelector('.demo-time-display');

  toggle.addEventListener('click', () => {
    demoMode = !demoMode;
    toggle.classList.toggle('active', demoMode);
    scrubber.style.display = demoMode ? 'flex' : 'none';
    if (onChange) onChange();
  });

  slider.addEventListener('input', () => {
    const val = parseInt(slider.value, 10);
    demoHours = Math.floor(val / 60);
    demoMinutes = val % 60;
    display.textContent = `${String(demoHours).padStart(2, '0')}:${String(demoMinutes).padStart(2, '0')}`;
    if (onChange) onChange();
  });
}

export function isDemoMode() {
  return demoMode;
}

export function getDemoTime() {
  return { hours: demoHours, minutes: demoMinutes };
}
