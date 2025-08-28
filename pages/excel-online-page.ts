import { Page } from '@playwright/test';
import { logger } from '../utils/logger';

export class ExcelOnlinePage {
  private frame: any;

  // Locators & constants
  private readonly iframeSelector = '//iframe[@id="WacFrame_Excel_0"]';
  private readonly documentTitleSelector = '//*[@data-unique-id="DocumentTitleContent"]';
  private readonly nameBoxButtonSelector = '//button[contains(@aria-label, "Name Box")]';
  private readonly nameBoxInputSelector = '//*[@id="FormulaBar-NameBox-input"]';
  private readonly formulaBarInputSelector = '[aria-label="Formula Bar"] input';
  private readonly activeCellFormulaSelector = '//*[@class="ql-editor ewa-rteTextElement"]//*[@class="ewa-rteLine"]';
  private readonly activeCellValueSelector = '//*[@id="m_excelWebRenderer_ewaCtl_readoutElementWrapper"]//label';

  constructor(private page: Page) {}

  // Wait for Excel iframe to load and get its frame handle
  private async getExcelFrame() {
    if (!this.frame) {
      const frameHandle = await this.page.waitForSelector(this.iframeSelector, { timeout: 20000 });
      this.frame = await frameHandle.contentFrame();
      if (!this.frame) throw new Error('Excel iframe not found');
    }
    return this.frame;
  }

  async waitForExcelToLoad() {
    const frame = await this.getExcelFrame();
    // Wait for the main grid or title element inside iframe
    await frame.waitForSelector(this.documentTitleSelector, { timeout: 20000 });
    await this.page.waitForTimeout(1000); // wait for rendering
  }

  async navigateToCell(cell: string) {
    const frame = await this.getExcelFrame();
    const nameBoxButton = frame.locator(this.nameBoxButtonSelector);
    const nameBoxInput = frame.locator(this.nameBoxInputSelector);

    await nameBoxButton.click();
    await nameBoxInput.fill(cell);
    await nameBoxInput.press('Enter'); // press Enter directly on the input
    await this.page.waitForTimeout(500);
  }

  async getCellValue(cell: string): Promise<string> {
    const frame = await this.getExcelFrame();
    await this.navigateToCell(cell);
    const formulaBar = frame.locator(this.formulaBarInputSelector);
    return (await formulaBar.inputValue()).trim();
  }

  async refreshSpreadsheet(): Promise<void> {
    logger.info('Refreshing spreadsheet...');
    try {
      const url = this.page.url();
      if (!url.includes('excel.cloud.microsoft')) {
        logger.info('Skipping reload: not on main Excel page.');
        return;
      }
      await this.page.reload({ waitUntil: 'domcontentloaded' });
      await this.waitForExcelToLoad();
      logger.info('Spreadsheet refreshed successfully.');
    } catch (e) {
      console.warn('Reload failed, continuing test...', e);
    }
  }

  async getValueFromActiveCellFormulaField(): Promise<string> {
    const frame = await this.getExcelFrame();
    const formulaBar = frame.locator(this.activeCellFormulaSelector);
    const value = await formulaBar.textContent();
    return value?.trim() || '';
  }

  async getValueFromActiveCell(): Promise<string> {
    const frame = await this.getExcelFrame();
    const formulaBar = frame.locator(this.activeCellValueSelector);
    const value = await formulaBar.first().getAttribute('aria-label');
    return value?.trim() || '';
  }
}
