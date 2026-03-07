import { test, expect } from '@playwright/test';

test.describe('Theme Switching', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('default theme is modern', async ({ page }) => {
    const app = page.locator('#app');
    await expect(app).toHaveClass(/theme-modern/);
  });

  test('switching to scientific theme changes appearance', async ({ page }) => {
    const app = page.locator('#app');
    const select = page.locator('#theme-select');

    await select.selectOption('scientific');
    await expect(app).toHaveClass(/theme-scientific/);
    await expect(app).not.toHaveClass(/theme-modern/);
  });

  test('switching to beautiful theme changes appearance', async ({ page }) => {
    const app = page.locator('#app');
    const select = page.locator('#theme-select');

    await select.selectOption('beautiful');
    await expect(app).toHaveClass(/theme-beautiful/);
  });

  test('locale switcher changes grid content', async ({ page }) => {
    const localeSelect = page.locator('#locale-select');

    // Default is English
    const firstLetterEn = await page.locator('.clock-letter').first().textContent();

    // Switch to German
    await localeSelect.selectOption('de');
    const firstLetterDe = await page.locator('.clock-letter').first().textContent();

    // English grid starts with I, German with E
    expect(firstLetterEn).toBe('I');
    expect(firstLetterDe).toBe('E');
  });
});
