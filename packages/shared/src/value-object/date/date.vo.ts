import { Result ,ValueObject ,ValueObjectConfig } from '../../base';
import { DateFormat } from './format';
import { DateLocale } from './types';

import { INVALID_DATE as CONST_INVALID_DATE } from './constants';
import { DateValidate } from './validate';

export interface DateConfig extends ValueObjectConfig {
  locale?: DateLocale;
}

export class DateVO extends ValueObject<Date ,DateConfig> {
  private static readonly INVALID_DATE = CONST_INVALID_DATE;
  private readonly _normalized: Date;
  private readonly _formatted: string;

  constructor(value: Date, config?: DateConfig) {
    super(value, config);
    this._normalized = DateVO.format.toDateOnly(value);
    this._formatted = DateVO.format.date(this._normalized, config?.locale);
  }

  get normalized(): Date {
    return this._normalized;
  }

  get formatted(): string {
    return this._formatted;
  }

  public static get format(): DateFormat {
    return new DateFormat();
  }

  public static get validate(): DateValidate {
    return new DateValidate();
  }

  public static tryCreate(value: Date, config?: DateConfig): Result<DateVO> {
    try {
      return Result.ok(new DateVO(value, config));
    } catch {
      return Result.fail(DateVO.INVALID_DATE);
    }
  }

  public static create(value: Date, config?: DateConfig): DateVO {
    const result = DateVO.tryCreate(value, config);
    result.validator.throwsIfFailed();
    return result.instance;
  }

  public static getWeekDays(locale: DateLocale = 'en-US'): Array<string> {
    const formatter = new Intl.DateTimeFormat(locale, {
      weekday: "short",
      timeZone: "UTC",
    });
    const currentYear = new Date().getUTCFullYear();
    const referenceDate = new Date(Date.UTC(currentYear, 0, 1));
    const dayOfWeek = referenceDate.getUTCDay();
    const sunday = new Date(referenceDate);
    sunday.setUTCDate(referenceDate.getUTCDate() - dayOfWeek);

    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(sunday);
      date.setUTCDate(sunday.getUTCDate() + index);
      const formattedDate = formatter.format(date);
      const cleanFormattedDate = formattedDate.replace(/\.$/, "");
      return cleanFormattedDate.charAt(0).toUpperCase() + cleanFormattedDate.slice(1);
    });
  }

  public static getInitialMonth(
    value?: Date | null,
    minDate?: Date,
    maxDate?: Date,
  ): Date {
    try {
      const normalizedValue = DateVO.format.toDateOnly(value);
      const normalizeMinDate = minDate ? DateVO.format.toDateOnly(minDate) : undefined;
      const normalizeMaxDate = maxDate ? DateVO.format.toDateOnly(maxDate) : undefined;

      if(normalizedValue && !DateVO.validate.isDateDisabled(normalizedValue, normalizeMinDate, normalizeMaxDate)) {
        return normalizedValue;
      }

      if(minDate) {
        return DateVO.format.toDateOnly(minDate);
      }

      return DateVO.format.toDateOnly(maxDate);
    } catch {
      return  DateVO.format.toDateOnly(new Date());
    }
  }

  public static addMonths(date: Date, amount: number): Date {
    return new Date(
      Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + amount, 1),
    );
  }

  public static getCalendarDays(month: Date): Array<Date> {
    const firstDay = DateVO._getFirstDayOfMonth(month);
    const daysInMonth = DateVO._getDaysInMonth(month);

    const previousMonth = DateVO.addMonths(month, -1);
    const daysInPreviousMonth = DateVO._getDaysInMonth(previousMonth);

    const previousMonthDays = Array.from(
      { length: firstDay },
      (_, index) => DateVO._fromDateParts(
        previousMonth.getUTCFullYear(),
        previousMonth.getUTCMonth(),
        daysInPreviousMonth - firstDay + index + 1,
      ),
    );

    const currentMonthDays = Array.from(
      { length: daysInMonth },
      (_, index) => DateVO._fromDateParts(
        month.getUTCFullYear(),
        month.getUTCMonth(),
        index + 1,
      ),
    );

    const totalDays = previousMonthDays.length + currentMonthDays.length;
    const remainingDays = (7 - (totalDays % 7)) % 7;

    const nextMonth = DateVO.addMonths(month, 1);

    const nextMonthDays = Array.from(
      { length: remainingDays },
      (_, index) =>
        DateVO._fromDateParts(
          nextMonth.getUTCFullYear(),
          nextMonth.getUTCMonth(),
          index + 1,
        ),
    );

    return [...previousMonthDays, ...currentMonthDays, ...nextMonthDays];

  }

  public static getMonthKey(date: Date): string {
    return `${date.getUTCFullYear()}-${DateVO._pad(date.getUTCMonth() + 1)}`;
  }

  public static getDateKey(date: Date): string {
    return `${date.getUTCFullYear()}-${DateVO._pad(date.getUTCMonth() + 1)}-${DateVO._pad(date.getUTCDate())}`;
  }

  public static isSameDate(first?: Date | null, second?: Date | null): boolean {
    return Boolean(first && second && DateVO.getDateKey(first) === DateVO.getDateKey(second));
  }

  private static _getFirstDayOfMonth(date: Date): number {
    return new Date(
      Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1),
    ).getUTCDay();
  }

  private static _getDaysInMonth(date: Date): number {
    return new Date(
      Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0),
    ).getUTCDate();
  }

  private static _fromDateParts (year: number, month: number, day: number): Date {
    return new Date(Date.UTC(year, month, day));
  }

  private static _pad(value: number): string {
    return String(value).padStart(2, "0");
  }
}