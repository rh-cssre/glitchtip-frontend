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
