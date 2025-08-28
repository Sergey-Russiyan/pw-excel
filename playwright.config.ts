import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  timeout: 50000,
  use: {
    headless: false,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 50000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
