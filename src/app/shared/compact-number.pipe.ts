import { inject, LOCALE_ID, Pipe, PipeTransform } from "@angular/core";

/** 12345 as "12.3K" in the app's locale; under 1000 unchanged. */
@Pipe({ name: "compactNumber" })
export class CompactNumberPipe implements PipeTransform {
  private readonly format = new Intl.NumberFormat(inject(LOCALE_ID), {
    notation: "compact",
    maximumFractionDigits: 1,
  });

  transform(value: number | string): string {
    return this.format.format(+value);
  }
}
