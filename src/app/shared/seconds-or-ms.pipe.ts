import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "secondsOrMS",
})
export class SecondsOrMSPipe implements PipeTransform {
  transform(value: string): string {
    let seconds = 0;
    if (value.includes(" ")) {
      seconds += parseInt(value.split(" ")[0], 10) * 86400;
      value = value.split(" ")[1];
    }
    const splitValue = value.split(":");
    seconds += parseInt(splitValue[0], 10) * 3600;
    seconds += parseInt(splitValue[1], 10) * 60;

    let secondsAndMS = parseFloat(splitValue[2]);
    if (isNaN(seconds) || isNaN(secondsAndMS)) {
      return ""
    } else {
      if (secondsAndMS > 1) {
        return `${(secondsAndMS + seconds).toFixed(2)} seconds`;
      } else {
        return `${Math.round(secondsAndMS * 1000)}ms`;
      }
    }
  }
}

