import { Pipe, PipeTransform } from "@angular/core";
import { timedeltaToMS } from "./shared.utils";

@Pipe({
  name: "secondsOrMS",
})
export class SecondsOrMSPipe implements PipeTransform {
  transform(value: string, roundSeconds: boolean = false): string {
    if (value) {
      const milliseconds = timedeltaToMS(value);
      if (milliseconds) {
        if (milliseconds > 1000) {
          return `${
            roundSeconds
              ? Math.round(milliseconds / 1000)
              : (milliseconds / 1000).toFixed(2)
          } seconds`;
        } else {
          return `${milliseconds}ms`;
        }
      } else {
        return "";
      }
    } else {
      return "";
    }
  }
}
