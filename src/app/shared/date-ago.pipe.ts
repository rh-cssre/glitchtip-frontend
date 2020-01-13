import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "dateAgo"
})
export class DateAgoPipe implements PipeTransform {
  transform(value: string): string {
    if (value) {
      const currentDate = Date.now();
      const inputDate = new Date(value).getTime();
      if (inputDate) {
        const days = Math.floor(
          (currentDate - inputDate) / (1000 * 60 * 60 * 24)
        );
        value = days.toString();
      }
    }
    return value;
  }
}
