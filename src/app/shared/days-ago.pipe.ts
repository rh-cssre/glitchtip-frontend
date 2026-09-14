import { Pipe, PipeTransform } from "@angular/core";
import { formatDistanceStrict } from "date-fns";

@Pipe({
  name: "daysAgo",
  standalone: true,
})
export class DaysAgoPipe implements PipeTransform {
  transform(value: string): string {
    return formatDateString(value, false, true);
  }
}

@Pipe({
  name: "daysOld",
  standalone: true,
})
export class DaysOldPipe implements PipeTransform {
  transform(value: string): string {
    return formatDateString(value, true, true);
  }
}

@Pipe({
  name: "timeFor",
  standalone: true,
})
export class TimeForPipe implements PipeTransform {
  transform(value: string): string {
    const formattedString = formatDateString(value, false, false);
    if (formattedString !== "") {
      return "for " + formattedString;
    } else {
      return formattedString;
    }
  }
}

function formatDateString(value: string, replaceAgo: boolean, suffix: boolean) {
  const inputDate = new Date(value).getTime();
  let date = "";
  try {
    date = formatDistanceStrict(inputDate, new Date(), {
      addSuffix: suffix,
    });
  } catch (err) {
    console.warn("Unable to process date", value);
    return "";
  }
  if (replaceAgo) {
    return date.replace("ago", "old");
  } else {
    return date;
  }
}
