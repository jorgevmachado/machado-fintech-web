import {
  TransactionFrequencyUnitMap ,
  type TransactionFrequencyUnitEnum,
} from '@/src/features/transactions/transaction-series';

/** How many upcoming occurrences the form previews. */
const PREVIEW_OCCURRENCES = 3;

export type TScheduleRule = {
  start_date: string;
  frequency_unit: TransactionFrequencyUnitEnum;
  frequency_interval: number;
  week_day?: number;
  day_of_month?: number;
  month?: number;
  installments?: number;
  end_date?: string;
};

export type TSchedulePreview = {
  /** `dd/mm/yyyy` of the first occurrences, in order. */
  occurrences: string[];
  /** `dd/mm/yyyy` of the last occurrence, when the series has a known end. */
  last_occurrence: string | null;
};

export const EMPTY_SCHEDULE_PREVIEW: TSchedulePreview = { occurrences: [], last_occurrence: null };

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

function toDateOnly(year: number, month: number, day: number): string {
  return `${year}-${pad(month)}-${pad(day)}`;
}

export function formatDateOnly(value: string): string {
  const [year, month, day] = value.split('-');

  return year && month && day ? `${day}/${month}/${year}` : value;
}

function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

/** The `day_of_month` anchored on a month that may be shorter (`31` becomes `28`/`29`/`30`). */
function clampDay(year: number, month: number, day: number): string {
  return toDateOnly(year, month, Math.min(day, daysInMonth(year, month)));
}

/**
 * Adds `months` to a `YYYY-MM-DD`, clamping the day so the arithmetic never rolls
 * over into the following month.
 */
function addMonths(value: string, months: number): string {
  const [yearText = '', monthText = '', dayText = ''] = value.split('-');
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const absolute = year * 12 + (month - 1) + months;

  return clampDay(Math.floor(absolute / 12), (absolute % 12) + 1, day);
}

function addYears(value: string, years: number): string {
  const [yearText = '', monthText = '', dayText = ''] = value.split('-');

  return clampDay(Number(yearText) + years, Number(monthText), Number(dayText));
}

function addDays(value: string, days: number): string {
  const [yearText = '', monthText = '', dayText = ''] = value.split('-');
  const date = new Date(Date.UTC(Number(yearText), Number(monthText) - 1, Number(dayText) + days));

  return toDateOnly(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate());
}

/** Monday = 1 … Sunday = 7, the numbering the backend uses for `week_day`. */
export function isoWeekDay(value: string): number {
  const [yearText = '', monthText = '', dayText = ''] = value.split('-');
  const utcWeekDay = new Date(Date.UTC(Number(yearText), Number(monthText) - 1, Number(dayText))).getUTCDay();

  return ((utcWeekDay + 6) % 7) + 1;
}

/**
 * First occurrence on or after the start date that falls on the chosen week day.
 * The start date itself always counts as an occurrence when the anchor matches.
 */
function firstOnWeekDay(startDate: string, weekDay: number): string {
  const offset = (weekDay - isoWeekDay(startDate) + 7) % 7;

  return offset === 0 ? startDate : addDays(startDate, offset);
}

function nextOccurrence(current: string, rule: TScheduleRule): string {
  const interval = Math.max(1, rule.frequency_interval);

  switch (rule.frequency_unit) {
    case TransactionFrequencyUnitMap.WEEK:
      return addDays(current, 7 * interval);
    case TransactionFrequencyUnitMap.MONTH:
      return addMonths(current, interval);
    case TransactionFrequencyUnitMap.YEAR:
      return addYears(current, interval);
  }
}

/** The first date the series generates, which is the one the anchors adjust. */
export function firstOccurrence(rule: TScheduleRule): string {
  if (rule.frequency_unit === TransactionFrequencyUnitMap.WEEK && rule.week_day !== undefined) {
    return firstOnWeekDay(rule.start_date, rule.week_day);
  }

  if (rule.frequency_unit === TransactionFrequencyUnitMap.MONTH && rule.day_of_month !== undefined) {
    const [yearText = '', monthText = ''] = rule.start_date.split('-');
    const candidate = clampDay(Number(yearText), Number(monthText), rule.day_of_month);

    return candidate >= rule.start_date ? candidate : addMonths(candidate, 1);
  }

  if (rule.frequency_unit === TransactionFrequencyUnitMap.YEAR && rule.day_of_month !== undefined && rule.month !== undefined) {
    const [yearText = ''] = rule.start_date.split('-');
    const candidate = clampDay(Number(yearText), rule.month, rule.day_of_month);

    return candidate >= rule.start_date ? candidate : clampDay(Number(yearText) + 1, rule.month, rule.day_of_month);
  }

  return rule.start_date;
}

/** Last occurrence of a closed series: the start plus `installments - 1` steps. */
function lastInstallment(rule: TScheduleRule, first: string): string | null {
  const installments = rule.installments ?? 0;
  if (installments <= 0) return null;

  let current = first;
  for (let index = 1; index < installments; index += 1) {
    current = nextOccurrence(current, rule);
  }

  return current;
}

/**
 * Preview of what the series will generate: the first occurrences and, when the
 * series ends, the last one. It never talks to the backend — the arithmetic is
 * the same the API applies, limited to what the form can show.
 */
export function buildSchedulePreview(rule: TScheduleRule): TSchedulePreview {
  if (!rule.start_date || !Number.isInteger(rule.frequency_interval) || rule.frequency_interval < 1) {
    return EMPTY_SCHEDULE_PREVIEW;
  }

  const first = firstOccurrence(rule);
  const occurrences: string[] = [];
  let current = first;

  for (let index = 0; index < PREVIEW_OCCURRENCES; index += 1) {
    if (rule.end_date && current > rule.end_date) break;
    occurrences.push(formatDateOnly(current));
    current = nextOccurrence(current, rule);
  }

  const last = rule.installments ? lastInstallment(rule, first) : (rule.end_date ?? null);

  return { occurrences, last_occurrence: last ? formatDateOnly(last) : null };
}