import { Page } from '@playwright/test';
import { logger } from '../utils/logger';

export class MicrosoftLoginPage {
  private static readonly DEFAULT_TIMEOUT = 5000;
  private static readonly SHORT_TIMEOUT = 2000;
  private static readonly NAVIGATION_WAIT = 2000;

  private readonly emailInput = '//input[@type="email"]'; 
  private readonly passwordInput = '//input[@type="password"]'; 
  private readonly nextButton = '//input[@type="submit"]'; 
  private readonly signInButton = '//button[@type="submit"]';
  private readonly usePasswordButton = '//*[@role="button"][.="Use your password"]'; 
  private readonly staySignedInText = 'text=Stay signed in?'; 
  private readonly submitButton = '//button[@type="submit"]';
  
  constructor(private page: Page) {}

  async login(email: string, password: string): Promise<void> {
    await this.enterEmailAndNext(email);
    await this.handleOptionalPasswordButton();
    await this.enterPasswordAndSignIn(password);
    await this.handleOptionalStaySignedIn();
  }

  private async enterEmailAndNext(email: string): Promise<void> {
    logger.info('Entering email');
    await this.page.waitForSelector(this.emailInput, { timeout: MicrosoftLoginPage.DEFAULT_TIMEOUT });
    await this.page.fill(this.emailInput, email);
    logger.info('Clicking "Next"');
    await this.page.click(this.nextButton);
    await this.waitForNavigation();
  }

  private async handleOptionalPasswordButton(): Promise<void> {
    const usePasswordButton = this.page.locator(this.usePasswordButton);
    await this.page.waitForTimeout(5000); 
    if (await this.isElementVisible(usePasswordButton, MicrosoftLoginPage.SHORT_TIMEOUT)) {
      logger.info('Clicking "Use your password" button');
      await usePasswordButton.click();
      await this.waitForNavigation();
    } else {
      logger.info('"Use your password" button not present, skipping');
    }
  }

  private async enterPasswordAndSignIn(password: string): Promise<void> {
    logger.info('Entering password and clicking "Sign in"');
    await this.page.waitForSelector(this.passwordInput, { timeout: MicrosoftLoginPage.DEFAULT_TIMEOUT });
    await this.page.fill(this.passwordInput, password);
    await this.page.click(this.signInButton);
    await this.waitForNavigation();
  }

  private async handleOptionalStaySignedIn(): Promise<void> {
    logger.info('Checking for optional "Stay signed in?" screen');
    const staySignedIn = this.page.locator(this.staySignedInText);
    
    if (await this.isElementVisible(staySignedIn, MicrosoftLoginPage.DEFAULT_TIMEOUT)) {
      logger.info('Clicking "Yes" on "Stay signed in?" dialog');
      await this.page.click(this.submitButton);
      await this.waitForNavigation();
    } else {
      logger.info('"Stay signed in?" dialog not present, skipping');
    }
  }

  private async isElementVisible(locator: any, timeout: number): Promise<boolean> {
    try {
      return await locator.isVisible({ timeout });
    } catch {
      return false;
    }
  }

  private async waitForNavigation(): Promise<void> {
    await this.page.waitForTimeout(MicrosoftLoginPage.NAVIGATION_WAIT);
  }

  // Configuration methods for different timeout scenarios
  static withCustomTimeouts(defaultTimeout: number, shortTimeout: number, navigationWait: number) {
    const originalDefaults = {
      DEFAULT_TIMEOUT: this.DEFAULT_TIMEOUT,
      SHORT_TIMEOUT: this.SHORT_TIMEOUT,
      NAVIGATION_WAIT: this.NAVIGATION_WAIT
    };

    this.DEFAULT_TIMEOUT = defaultTimeout;
    this.SHORT_TIMEOUT = shortTimeout;
    this.NAVIGATION_WAIT = navigationWait;

    return originalDefaults;
  }
}