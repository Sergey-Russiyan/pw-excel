// tests/base/BaseTest.ts
import { test as base, Browser, BrowserContext, Page, chromium } from '@playwright/test';

export class BaseTest {
    protected static browser: Browser;
    protected static context: BrowserContext;
    protected static page: Page;

    static async setupBrowser() {
        console.log('=== Starting browser ===');
        this.browser = await chromium.launch(); // Respects config and CLI flags
        this.context = await this.browser.newContext();
        this.page = await this.context.newPage();
    }

    static async teardownBrowser() {
        console.log('=== Closing browser ===');
        if (this.page) await this.page.close();
        if (this.context) await this.context.close();
        if (this.browser) await this.browser.close();
    }

    // Getter methods for easy access in test classes
    protected get browser(): Browser {
        return BaseTest.browser;
    }

    protected get context(): BrowserContext {
        return BaseTest.context;
    }

    protected get page(): Page {
        return BaseTest.page;
    }
}

export { expect } from '@playwright/test';