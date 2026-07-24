// @ts-check
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  timeout: 30_000,
  retries: 0,
  reporter: [['list']],
  use: {
    // Backend serves API under /api
    baseURL: process.env.API_BASE_URL || 'http://localhost:3001',
  },
  // Keep output isolated and git-tracked only where we explicitly save results.
  outputDir: 'tmp-playwright-artifacts',
  preserveOutput: 'failures-only',
});
