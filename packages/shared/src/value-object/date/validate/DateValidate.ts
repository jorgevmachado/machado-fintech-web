export class DateValidate {
  public isBefore(date: Date, compareDate?: Date): boolean {
    return compareDate ? date.getTime() < compareDate.getTime() : false;
  }

  public isAfter(date: Date, compareDate?: Date): boolean {
    return compareDate ? date.getTime() > compareDate.getTime() : false;
  }

  public isDateDisabled(date: Date, minDate?: Date, maxDate?: Date): boolean {
    return Boolean(
      (date && this.isBefore(date, minDate)) ||
      (date && this.isAfter(date, maxDate)),
    );
  }
}