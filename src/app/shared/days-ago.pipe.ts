import { inject, LOCALE_ID, Pipe, PipeTransform } from "@angular/core";
import { formatDistanceStrict, Locale } from "date-fns";
import { fr, nb } from "date-fns/locale";

// date-fns locales for the UI languages; English is date-fns' default
export const dateFnsLocales: { [key: string]: Locale } = { fr, nb };

@Pipe({
  name: "daysAgo",
  standalone: true,
})
export class DaysAgoPipe implements PipeTransform {
  private locale = dateFnsLocales[inject(LOCALE_ID)];

  transform(value: string): string {
    return formatDateString(value, true, this.locale);
  }
}

@Pipe({
  name: "daysOld",
  standalone: true,
})
export class DaysOldPipe implements PipeTransform {
  private locale = dateFnsLocales[inject(LOCALE_ID)];

  transform(value: string): string {
    const formattedString = formatDateString(value, true, this.locale);
    // "in 5 minutes" (a future date) is shown as it is, as before
    if (formattedString.endsWith(" ago") && !this.locale) {
      return formattedString.replace("ago", "old");
    }
    if (this.locale) {
      const distance = formatDateString(value, false, this.locale);
      return distance === "" ? "" : $localize`${distance}:distance: old`;
    }
    return formattedString;
  }
}

@Pipe({
  name: "timeFor",
  standalone: true,
})
export class TimeForPipe implements PipeTransform {
  private locale = dateFnsLocales[inject(LOCALE_ID)];

  transform(value: string): string {
    const formattedString = formatDateString(value, false, this.locale);
    if (formattedString !== "") {
      return $localize`for ${formattedString}:duration:`;
    } else {
      return formattedString;
    }
  }
}

function formatDateString(value: string, suffix: boolean, locale?: Locale) {
  const inputDate = new Date(value).getTime();
  try {
    return formatDistanceStrict(inputDate, new Date(), {
      addSuffix: suffix,
      locale,
    });
  } catch (err) {
    console.warn("Unable to process date", value);
    return "";
  }
}
