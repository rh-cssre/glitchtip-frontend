import { Pipe, PipeTransform } from "@angular/core";
import { timedeltaToMS } from "./shared.utils";

/** A duration as a number and a short unit, for figures that set the unit apart. */
export function durationParts(value: string | number): {
  value: string;
  unit: "s" | "ms";
} {
  const milliseconds = typeof value === "string" ? timedeltaToMS(value) : value;
  return milliseconds > 999
    ? { value: (milliseconds / 1000).toFixed(2), unit: "s" }
    : { value: String(Math.round(milliseconds)), unit: "ms" };
}

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
