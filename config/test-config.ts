export const testConfig = {
  credentials: {
    email: process.env.EXCEL_EMAIL,
    password: process.env.EXCEL_PASSWORD,
  },
  spreadsheetUrl: process.env.EXCEL_URL,
  timeout: 60000,
};