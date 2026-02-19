import { test } from '@playwright/test';
import * as auth from '../../pages/authentication';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('should register successfully', async ({ page }) => {
  await auth.register(page);
  await auth.assertDashboardPage(page);
});

test('should login and logout successfully', async ({ page }) => {
  await auth.login(page);
  await auth.assertDashboardPage(page);
  await auth.logout(page);
  await auth.assertLoginPage(page);
});