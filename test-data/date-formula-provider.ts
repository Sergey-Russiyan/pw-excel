import { DateHelpers } from '../utils/date-helpers';

export interface DateFormulaTestCase {
  cellAddress: string;
  formula: string;
  expectedValue: string;
  description: string;
}

export class DateFormulaTestDataProvider {
  private static readonly testCases: DateFormulaTestCase[] = [
    {
      cellAddress: 'A1',
      formula: '=TODAY()',
      expectedValue: DateHelpers.getTodayFormattedExcelStyle(),
      description: 'Current date using TODAY() function',
    },
    {
      cellAddress: 'A2',
      formula: '=TODAY()+1',
      expectedValue: DateHelpers.getTomorrowExcelStyle(),
      description: "Tomorrow's date (TODAY + 1 day)",
    },
    {
      cellAddress: 'A3',
      formula: '=TODAY()-1',
      expectedValue: DateHelpers.getYesterdayExcelStyle(),
      description: "Yesterday's date (TODAY - 1 day)",
    },
    {
      cellAddress: 'A4',
      formula: '=YEAR(TODAY())-2000',
      expectedValue: DateHelpers.getYearsSince2000().toString(),
      description: 'Years since 2000',
    },
    {
      cellAddress: 'A5',
      formula: '=DAY(TODAY())',
      expectedValue: DateHelpers.getCurrentDay().toString(),
      description: 'Current day of the month',
    },
    {
      cellAddress: 'A6',
      formula: '=MONTH(TODAY())',
      expectedValue: DateHelpers.getCurrentMonth().toString(),
      description: 'Current month number',
    },
    {
      cellAddress: 'A7',
      formula: '=YEAR(TODAY())',
      expectedValue: DateHelpers.getCurrentYear().toString(),
      description: 'Current year',
    },
    {
      cellAddress: 'A8',
      formula: '=WEEKDAY(TODAY())',
      expectedValue: DateHelpers.getCurrentWeekday().toString(),
      description: 'Day of the week (1=Sunday, 7=Saturday)',
    },
    {
      cellAddress: 'A9',
      formula: '=DATEDIF(TODAY(),TODAY()+365,"D")',
      expectedValue: '365',
      description: 'Days in a year (difference calculation)',
    },
    {
      cellAddress: 'A10',
      formula: '=TEXT(TODAY(),"YYYY")',
      expectedValue: DateHelpers.getCurrentYear().toString(),
      description: 'Current year as text using TEXT function',
    },
    {
      cellAddress: 'A11',
      formula: '=TEXT(TODAY(),"MMMM")',
      expectedValue: new Date().toLocaleString('default', { month: 'long' }),
      description: 'Current month name as text',
    },
  ];

  static getAllDateFormulas(): DateFormulaTestCase[] {
    return this.testCases;
  }
}
