import { Pipe, PipeTransform } from "@angular/core";
import { formatDistanceStrict } from "date-fns";

@Pipe({
  name: "daysAgo",
})
export class DaysAgoPipe implements PipeTransform {
  transform(value: string): string {
    const inputDate = new Date(value).getTime();
    try {
      return formatDistanceStrict(inputDate, new Date(), { addSuffix: true });
    } catch (err) {
      console.warn("Unable to process date", value);
      return "";
    }
  }
}

@Pipe({
  name: "daysOld",
})
export class DaysOldPipe implements PipeTransform {
  transform(value: string): string {
    const inputDate = new Date(value).getTime();
    try {
      const date = formatDistanceStrict(inputDate, new Date(), {
        addSuffix: true,
      });
      return date.replace("ago", "old");
    } catch (err) {
      console.warn("Unable to process date", value);
      return "";
    }
  }
}
