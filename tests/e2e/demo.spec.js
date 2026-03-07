import { test, expect } from '@playwright/test';

test.describe('Demo Mode', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Open settings panel so demo controls are clickable
    await page.locator('#settings-toggle').click();
    await expect(page.locator('#settings-panel')).toHaveClass(/open/);
  });

  test('demo toggle shows scrubber', async ({ page }) => {
    const toggle = page.locator('.demo-toggle');
    const scrubber = page.locator('.demo-scrubber');

    await expect(scrubber).toBeHidden();
    await toggle.click();
    await expect(scrubber).toBeVisible();
  });

  test('sliding scrubber changes displayed time', async ({ page }) => {
    // Enter demo mode
    await page.locator('.demo-toggle').click();

    const slider = page.locator('.time-slider');
    const display = page.locator('.demo-time-display');

    // Get initial active letters
    const initialActive = await page.locator('.clock-letter.active').allTextContents();

    // Move slider to a different position (e.g., value=0 = 00:00)
    await slider.fill('0');
    await slider.dispatchEvent('input');

    await expect(display).toHaveText('00:00');

    // Move to 18:00 (value=1080)
    await slider.fill('1080');
    await slider.dispatchEvent('input');

    await expect(display).toHaveText('18:00');
  });

  test('minute indicators light up for extra minutes', async ({ page }) => {
    await page.locator('.demo-toggle').click();

    const slider = page.locator('.time-slider');

    // Set to 7:24 (value = 7*60+24 = 444)
    await slider.fill('444');
    await slider.dispatchEvent('input');

    await expect(page.locator('.demo-time-display')).toHaveText('07:24');

    // Only +, 4, and MINUTES should be active
    const activeMinutes = page.locator('.minute-indicator.active');
    await expect(activeMinutes).toHaveCount(3);
    const texts = await activeMinutes.allTextContents();
    expect(texts).toEqual(['+', '4', 'MINUTES']);
  });

  test('no minute indicators at exact 5-min boundary', async ({ page }) => {
    await page.locator('.demo-toggle').click();

    const slider = page.locator('.time-slider');

    // Set to 7:20 (value = 440)
    await slider.fill('440');
    await slider.dispatchEvent('input');

    const activeMinutes = page.locator('.minute-indicator.active');
    await expect(activeMinutes).toHaveCount(0);
  });

  test('toggling demo off returns to live mode', async ({ page }) => {
    const toggle = page.locator('.demo-toggle');

    await toggle.click();
    await expect(page.locator('.demo-scrubber')).toBeVisible();

    await toggle.click();
    await expect(page.locator('.demo-scrubber')).toBeHidden();
  });
});
