import { Pipe, PipeTransform } from "@angular/core";
import { timedeltaToMS } from "./shared.utils";

@Pipe({
  name: "humanizeDuration",
  standalone: true,
})
export class HumanizeDurationPipe implements PipeTransform {
  transform(value: string | number, roundSeconds: boolean = false): string {
    try {
      const milliseconds =
        typeof value === "string" ? timedeltaToMS(value) : value;
      if (milliseconds > 999) {
        const seconds = roundSeconds
          ? Math.round(milliseconds / 1000)
          : (milliseconds / 1000).toFixed(2);
        return $localize`${seconds}:seconds: seconds`;
      } else {
        return `${+milliseconds.toFixed(2)}ms`;
      }
    } catch (err) {
      console.warn("Provided string was not a valid timedelta");
      return "";
    }
  }
}

/** A duration as one short figure for a stat: "815ms", "1.60s". */
@Pipe({ name: "shortDuration" })
export class ShortDurationPipe implements PipeTransform {
  transform(value: string | number): string {
    try {
      const ms = typeof value === "string" ? timedeltaToMS(value) : value;
      return ms >= 999.5 ? `${(ms / 1000).toFixed(2)}s` : `${Math.round(ms)}ms`;
    } catch {
      return "";
    }
  }
}
