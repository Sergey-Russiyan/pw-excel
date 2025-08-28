import { test, expect } from '@playwright/test';
import { ExcelOnlinePage } from '../pages/excel-online-page';
import { MicrosoftLoginPage } from '../pages/microsoft-login-page';
import { testConfig } from '../config/test-config';
import { DateFormulaTestDataProvider, DateFormulaTestCase } from '../test-data/date-formula-provider';
import { BaseTest } from '../tests/base-test';
import { logger } from '../utils/logger';
import dotenv from 'dotenv';

dotenv.config();

class ExcelFormulaTest extends BaseTest {
    protected excelPage: ExcelOnlinePage;
    protected loginPage: MicrosoftLoginPage;

    async setupExcelEnvironment() {
        this.loginPage = new MicrosoftLoginPage(this.page);
        this.excelPage = new ExcelOnlinePage(this.page);

        logger.info(`Navigating to spreadsheet URL: ${testConfig.spreadsheetUrl}`);
        await this.page.goto(testConfig.spreadsheetUrl, { waitUntil: 'domcontentloaded' });
        await this.page.waitForTimeout(3000); // MS Excel doc could be unstable state after initial load
        await this.loginPage.login(testConfig.credentials.email, testConfig.credentials.password);
        logger.info('Waiting for Excel to load...');
        await this.excelPage.refreshSpreadsheet();
        await this.excelPage.waitForExcelToLoad();
        logger.info('Excel loaded successfully.');
    }

    getExcelPage(): ExcelOnlinePage {
        return this.excelPage;
    }
}

test.describe('Excel "=TODAY()" Formula Tests - ensures formula evaluates correctly in different scenarios', () => {
    const testInstance = new ExcelFormulaTest();

    test.beforeAll(async () => {
        await BaseTest.setupBrowser();
        await testInstance.setupExcelEnvironment();
    });

    test.afterAll(async () => {
        await BaseTest.teardownBrowser();
    });

    const dateFormulaTestCases = DateFormulaTestDataProvider.getAllDateFormulas();

    for (const testCase of dateFormulaTestCases) {
        test(`${testCase.cellAddress}: ${testCase.description}`, async () => {
            logger.info(`=== Running test for ${testCase.cellAddress}: ${testCase.description} ===`);

            const excelPage = testInstance.getExcelPage();

            await excelPage.waitForExcelToLoad();
            await excelPage.navigateToCell(testCase.cellAddress);

            const actualFormula = await excelPage.getValueFromActiveCellFormulaField();
            logger.info(`Formula in ${testCase.cellAddress}: ${actualFormula}`);

            const actualCellValue = await excelPage.getValueFromActiveCell();
            logger.info(`Active Cell value in ${testCase.cellAddress}: ${actualCellValue}`);

            expect(actualFormula, `Expected formula '${testCase.formula}' but got '${actualFormula}' in ${testCase.cellAddress}`)
                .toBe(testCase.formula);

            expect(actualCellValue, `Expected value to contain '${testCase.expectedValue}' but got '${actualCellValue}' in ${testCase.cellAddress}`)
                .toContain(testCase.expectedValue);

            expect(actualCellValue, `Expected cell reference '${testCase.cellAddress}' in '${actualCellValue}'`)
                .toContain(testCase.cellAddress);

            expect(actualCellValue, `Expected 'Contains Formula' in '${actualCellValue}' for ${testCase.cellAddress}`)
                .toContain('Contains Formula');

            logger.info(`=== Test passed for ${testCase.cellAddress} ===\n`);
        });
    }
});