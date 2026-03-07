import { test, expect } from '@playwright/test';

test.describe('Word Clock', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('renders the letter grid', async ({ page }) => {
    const grid = page.locator('.clock-grid');
    await expect(grid).toBeVisible();

    const rows = page.locator('.clock-row');
    await expect(rows).toHaveCount(11); // 10 letter rows + 1 minute indicator row

    // 10x11 grid letters + 6 minute indicators (+, 1, 2, 3, 4, label)
    const letters = page.locator('.clock-letter');
    const count = await letters.count();
    expect(count).toBe(116);
  });

  test('highlights active letters', async ({ page }) => {
    const activeLetters = page.locator('.clock-letter.active');
    // At any time, some letters should be active (at least "IT IS" or "ES IST")
    await expect(activeLetters.first()).toBeVisible();
    const count = await activeLetters.count();
    expect(count).toBeGreaterThan(2);
  });

  test('letters have transition styles', async ({ page }) => {
    const letter = page.locator('.clock-letter').first();
    const transition = await letter.evaluate(el => getComputedStyle(el).transition);
    expect(transition).toContain('opacity');
  });
});
