import { Pipe, PipeTransform } from "@angular/core";
import { timedeltaToMS } from "./shared.utils";

@Pipe({
  name: "humanizeDuration",
})
export class HumanizeDurationPipe implements PipeTransform {
  transform(value: string, roundSeconds: boolean = false): string {
    try {
      const milliseconds = timedeltaToMS(value);
      if (milliseconds > 999) {
        return `${
          roundSeconds
            ? Math.round(milliseconds / 1000)
            : (milliseconds / 1000).toFixed(2)
        } seconds`;
      } else {
        return `${milliseconds}ms`;
      }
    } catch (err) {
      console.warn("Provided string was not a valid timedelta");
      return "";
    }
  }
}
