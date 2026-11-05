import type { DateLocale } from '../types';
import { INVALID_DATE } from '../constants';

export class DateFormat {
  public dateStringToDate(dateString?: string): Date | undefined {
    if (!dateString) {
      return undefined;
    }

    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateString);
    if (!match) {
      return undefined;
    }

    const [, year, month, day] = match;
    const yearNumber = Number(year);
    const monthNumber = Number(month);
    const dayNumber = Number(day);
    const date = new Date(0);
    date.setUTCHours(0, 0, 0, 0);
    date.setUTCFullYear(yearNumber, monthNumber - 1, dayNumber);

    if (
      monthNumber < 1 ||
      monthNumber > 12 ||
      date.getUTCFullYear() !== yearNumber ||
      date.getUTCMonth() !== monthNumber - 1 ||
      date.getUTCDate() !== dayNumber
    ) {
      return undefined;
    }

    return date;
  }

  public dateTimeStringToDate(dateTimeString?: string): Date | undefined {
    if (!dateTimeString) {
      return undefined;
    }

    const isoDateTimePattern = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d+)?(Z|([+-])(\d{2}):(\d{2}))$/;
    const match = dateTimeString.match(isoDateTimePattern);
    if (!match) {
      return undefined;
    }

    const [, year, month, day, hour, minute, second, , , offsetHour, offsetMinute] = match;
    const yearNumber = Number(year);
    const monthNumber = Number(month);
    const dayNumber = Number(day);
    const hourNumber = Number(hour);
    const minuteNumber = Number(minute);
    const secondNumber = Number(second);
    const offsetHourNumber = Number(offsetHour ?? 0);
    const offsetMinuteNumber = Number(offsetMinute ?? 0);
    const daysInMonth = new Date(Date.UTC(yearNumber, monthNumber, 0)).getUTCDate();

    if (
      monthNumber < 1 || monthNumber > 12 ||
      dayNumber < 1 || dayNumber > daysInMonth ||
      hourNumber > 23 ||
      minuteNumber > 59 ||
      secondNumber > 59 ||
      offsetHourNumber > 23 ||
      offsetMinuteNumber > 59
    ) {
      return undefined;
    }

    return new Date(dateTimeString);
  }

  public dateToDateString(date?: Date | string): string | undefined {
    const rawDate = typeof date === 'string' ? new Date(date) : date;

    if(!rawDate || isNaN(rawDate.getTime())) {
      return undefined;
    }

    return rawDate.toISOString().split('T')[0];
  }

  public date(date?: Date | string, locale: DateLocale = 'en-US'): string {
    const rawDate = typeof date === 'string' ? new Date(date) : date;
    if(!rawDate || isNaN(rawDate.getTime())) {
      return '';
    }
    return new Intl.DateTimeFormat(locale, { timeZone: 'UTC' }).format(rawDate);
  }

  public toDateOnly(date?: Date | null): Date {
    if(!date || isNaN(date.getTime())) {
      throw new Error(INVALID_DATE);
    }
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  }

  public month(date?: Date | string, locale: DateLocale = 'en-US'): string {
    const rawDate = typeof date === 'string' ? new Date(date) : date;
    if(!rawDate || isNaN(rawDate.getTime())) {
      return '';
    }
    return new Intl.DateTimeFormat(locale, {
      month: 'long',
      timeZone: 'UTC'
    }).format(rawDate);
  }
}