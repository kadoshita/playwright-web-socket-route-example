// @ts-check
import { test, expect } from '@playwright/test';
import { randomUUID } from 'crypto';

test('send message', async ({ page }) => {
  const uuid = randomUUID();
  await page.routeWebSocket(/.*/, (ws) => {
    ws.onMessage((message) => {
      console.log('>', message);
      if (message === uuid) {
        console.log('<', 'Hello, World!');
        ws.send('Hello, World!');
      }
    });
  });

  await page.goto('http://localhost:5173/client/index.html');

  await page.getByLabel('input').fill(uuid);

  await page.getByText('Send').click();

  await expect(page.getByText('Hello, World!').isVisible()).resolves.toBe(true);
});
