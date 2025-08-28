export interface DateFormulaTestCase {
  cellAddress: string;
  formula: string;
  expectedValue: string;
  description: string;
}

export class DateHelpers {
  static getCurrentDate(): Date {
    return new Date();
  }

  static formatDate(date: Date, format: 'MM/DD/YYYY' | 'DD/MM/YYYY' = 'MM/DD/YYYY'): string {
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    
    return format === 'MM/DD/YYYY' ? `${month}/${day}/${year}` : `${day}/${month}/${year}`;
  }

  static formatDateExcelStyle(date: Date, format: 'MM/DD/YYYY' | 'DD/MM/YYYY' = 'MM/DD/YYYY'): string {
    // Excel format without zero-padding for single digits
    const month = (date.getMonth() + 1).toString();
    const day = date.getDate().toString();
    const year = date.getFullYear().toString();
    
    return format === 'MM/DD/YYYY' ? `${month}/${day}/${year}` : `${day}/${month}/${year}`;
  }

  static normalizeDate(dateString: string): string {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      throw new Error(`Invalid date string: ${dateString}`);
    }
    return this.formatDate(date);
  }

  static compareDates(date1: string, date2: string): boolean {
    try {
      const normalized1 = this.normalizeDate(date1);
      const normalized2 = this.normalizeDate(date2);
      return normalized1 === normalized2;
    } catch {
      return false;
    }
  }

  static isValidDate(dateString: string): boolean {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  }

  static getTodayFormatted(): string {
    return this.formatDate(this.getCurrentDate());
  }

  static getTodayFormattedExcelStyle(): string {
    return this.formatDateExcelStyle(this.getCurrentDate());
  }

  static getTomorrowExcelStyle(): string {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return this.formatDateExcelStyle(tomorrow);
  }

  static getYesterdayExcelStyle(): string {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return this.formatDateExcelStyle(yesterday);
  }

  static getCurrentYear(): number {
    return new Date().getFullYear();
  }

  static getCurrentMonth(): number {
    return new Date().getMonth() + 1; // 1-12
  }

  static getCurrentDay(): number {
    return new Date().getDate();
  }

  static getYearsSince2000(): number {
    return this.getCurrentYear() - 2000;
  }

  static calculateDaysUntilDate(targetDate: string): number {
    const target = new Date(targetDate);
    const today = new Date();
    const diffTime = target.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  static getDatePlusDays(days: number): string {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return this.formatDateExcelStyle(date);
  }

  static getDateMinusDays(days: number): string {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return this.formatDateExcelStyle(date);
  }

  static getEndOfCurrentMonth(): string {
    const date = new Date();
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return this.formatDateExcelStyle(lastDay);
  }

  static getFirstDayOfCurrentMonth(): string {
    const date = new Date();
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    return this.formatDateExcelStyle(firstDay);
  }

  static getCurrentWeekday(): number {
    return new Date().getDay() + 1; // Excel weekday: Sunday=1, Monday=2, etc.
  }
}