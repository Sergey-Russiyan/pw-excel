# Excel Online "=TODAY()" Formula End-to-End Test

This repository contains a **TypeScript** and **Playwright** project that automates end-to-end testing of the standard `=TODAY()` function in **Excel Online** using the **Chrome browser**. The test verifies that the returned value corresponds to the current date when the test is executed.

---

## Table of Contents
- [Project Overview](#project-overview)
- [Prerequisites](#prerequisites)
- [Configuration](#configuration)
- [Installation](#installation)
- [Running the Tests](#running-the-tests)
- [Project Structure](#project-structure)
- [Known Limitations & Workarounds](#known-limitations--workarounds)
- [Demo & FAQ](#demo--faq)
- [Contributing](#contributing)
- [License](#license)

---

## Project Overview

This test suite performs the following steps:

1. Launches Chrome browser using Playwright.
2. Navigates to the Excel Online spreadsheet URL provided in the configuration.
3. Detects if Microsoft login is required and performs login using credentials from a secure configuration file.
4. Waits for Excel Online to fully load.
5. Navigates to a specific cell and verifies:
   - The formula in the cell matches `=TODAY()`.
   - The calculated value corresponds to the current date.
   - The cell value contains the cell reference and the text `"Contains Formula"`.
6. Logs detailed information for each step.

The suite is modular with separate page objects for:
- **MicrosoftLoginPage** – handles login workflow.
- **ExcelOnlinePage** – handles Excel navigation, formula reading, and cell value retrieval.

---

## Prerequisites

- Node.js >= 18.x
- npm >= 9.x
- Playwright >= 1.40
- TypeScript >= 5.x
- Chrome browser (automatically installed by Playwright)

---

## Configuration

All configuration data such as login credentials and spreadsheet URL are stored in a separate configuration file (`test-config.ts`) and environment variables using `.env`.

Example `.env`:

```env
EXCEL_URL=https://excel.office.com/spreadsheet/...
EXCEL_EMAIL=your.email@domain.com
EXCEL_PASSWORD=yourStrongPassword
```
usage:

```ts
export const testConfig = {
  spreadsheetUrl: process.env.EXCEL_URL || '',
  credentials: {
    email: process.env.EXCEL_EMAIL || '',
    password: process.env.EXCEL_PASSWORD || ''
  }
};
```

*Note:* Do not commit .env to GitHub. Use `.gitignore` to exclude it.

---

## Installation

1. Clone the repository:

```bash
git clone https://github.com/Sergey-Russiyan/pw-excel
cd pw-excel
```

2. Install dependencies:

```bash
npm install
```

3. Install Playwright browsers:

```bash
npx playwright install
```

---

## Running the Tests

Execute all tests using the Playwright Test runner:

```bash
npx playwright test
```

Run in headed mode (visual debugging):
```bash
npx playwright test --headed
```

Generate an HTML report:
```bash
npx playwright show-report
```

---

```bash
.
├── pages
│   ├── excel-online-page.ts      # Page object for Excel Online interactions
│   └── microsoft-login-page.ts   # Page object for Microsoft login
├── test-data
│   └── date-formula-provider.ts  # Provides test data for =TODAY()
├── tests
│   └── excel-today.spec.ts     # Main actual tests for =TODAY()
├── utils
│   └── logger.ts                 # Custom logger
├── config
│   └── test-config.ts            # Configuration for URL and credentials
├── .env                          # Environment variables (excluded from Git)
├── package.json
└── README.md

```

---

### Known Limitations & Workarounds

**Login flow variations:** Some accounts may trigger additional screens (e.g., MFA). Manual adjustments may be required.

**Excel rendering delay:** Excel Online can take a few seconds to stabilize after loading. This is handled using waitForTimeout, but intermittent delays may still occur.

**Headless mode differences:** Some Excel UI elements behave slightly differently in headless mode. Running with `--headed` is recommended for debugging.

**Browser-specific behavior:** Tests are developed for Chrome; other browsers may require tweaks.

 **Sample Excel file dependencies**: Our sample spreadsheet already contains specific variations of formulas in **hardcoded cells** (e.g., `A1` contains `=TODAY()`) along with expected results such as:


```ts
{
  cellAddress: 'A1',
  formula: '=TODAY()',
  expectedValue: DateHelpers.getTodayFormattedExcelStyle(),
  description: 'Current date using TODAY() function',
}
```
These hardcoded formulas and expected values are considered “magic numbers” in the tests. Accidental updates to the sample Excel file (e.g., editing or moving these cells) may break the tests, so it’s important to preserve the file structure and contents when running or modifying tests.

---

### Demo & FAQ

**Demo recording:** A demo of the test execution is available in the demo/ folder (video recording showing login, Excel navigation, and formula verification).

### FAQ:

*How do I run the test locally?*

Ensure `.env` is configured, install dependencies, and run npx playwright test.


*Can I test other formulas?*

Yes, by extending DateFormulaTestDataProvider with other formulas and expected results.


*What if login fails?*

Ensure credentials in `.env` are correct and account does not require MFA for automated login.


*Alternative solutions?*

For more robust automation, consider using `Microsoft Graph API` for Excel operations instead of UI automation.

---

### Contributing

1. Fork the repository.
2. Create a new branch for your feature/bugfix.
3. Commit changes with clear messages.
4. Submit a pull request with description.