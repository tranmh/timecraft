import { describe, test, expect, beforeEach } from '@jest/globals';
import { initThemes, setTheme, getTheme, getThemes } from '../../src/js/themes.js';

describe('themes', () => {
  let appEl;

  beforeEach(() => {
    localStorage.clear();
    appEl = document.createElement('div');
    appEl.id = 'app';
    document.body.appendChild(appEl);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('getThemes returns all three themes', () => {
    expect(getThemes()).toEqual(['modern', 'beautiful', 'scientific', 'arctic', 'ember', 'forest', 'ocean', 'retro', 'sand', 'cosmos']);
  });

  test('initThemes defaults to modern', () => {
    initThemes(appEl);
    expect(getTheme()).toBe('modern');
    expect(appEl.classList.contains('theme-modern')).toBe(true);
  });

  test('setTheme changes theme class', () => {
    initThemes(appEl);
    setTheme('scientific', appEl);
    expect(getTheme()).toBe('scientific');
    expect(appEl.classList.contains('theme-scientific')).toBe(true);
    expect(appEl.classList.contains('theme-modern')).toBe(false);
  });

  test('setTheme persists to localStorage', () => {
    initThemes(appEl);
    setTheme('beautiful', appEl);
    expect(localStorage.getItem('timecraft-theme')).toBe('beautiful');
  });

  test('initThemes restores saved theme', () => {
    localStorage.setItem('timecraft-theme', 'scientific');
    initThemes(appEl);
    expect(getTheme()).toBe('scientific');
    expect(appEl.classList.contains('theme-scientific')).toBe(true);
  });

  test('setTheme ignores invalid theme', () => {
    initThemes(appEl);
    setTheme('invalid', appEl);
    expect(getTheme()).toBe('modern');
  });

  test('theme class is applied to app element', () => {
    initThemes(appEl);
    expect(appEl.classList.contains('theme-modern')).toBe(true);
    setTheme('beautiful', appEl);
    expect(appEl.classList.contains('theme-beautiful')).toBe(true);
    expect(appEl.classList.contains('theme-modern')).toBe(false);
  });
});
