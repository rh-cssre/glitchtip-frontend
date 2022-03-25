import { Pipe, PipeTransform } from "@angular/core";
import { timedeltaToMS } from "./shared.utils";
import { captureException } from "@sentry/angular";

@Pipe({
  name: "secondsOrMS",
})
export class SecondsOrMSPipe implements PipeTransform {
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
      captureException(err);
      return "";
    }
  }
}
