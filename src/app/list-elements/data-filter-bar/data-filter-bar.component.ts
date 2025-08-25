import { formatDate } from "@angular/common";
import { Component, Input, input, output } from "@angular/core";
import { FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatNativeDateModule, MatOptionModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatInputModule } from "@angular/material/input";
import { MatSelectChange, MatSelectModule } from "@angular/material/select";

@Component({
  selector: "gt-data-filter-bar",
  imports: [
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    ReactiveFormsModule,
    MatOptionModule,
    MatSelectModule,
  ],
  templateUrl: "./data-filter-bar.component.html",
  styleUrls: ["./data-filter-bar.component.scss"],
})
export class DataFilterBarComponent {
  @Input() dateForm?: FormGroup;
  @Input() sortForm?: FormGroup;
  readonly sorts = input<
    {
      param: string;
      display: string;
    }[]
  >();
  @Input() environmentForm?: FormGroup;
  @Input() searchForm?: FormGroup;
  readonly organizationEnvironments = input<string[]>([]);

  readonly dateFormSubmission = output<object>();
  readonly dateFormReset = output();
  readonly filterByEnvironment = output<MatSelectChange>();
  readonly searchSubmit = output();
  readonly sortByChanged = output<MatSelectChange>();

  convertToZTime(date: Date) {
    return formatDate(date, "yyyy-MM-ddTHH:mm:ss.SSS", "en-US") + "Z";
  }

  onDateFormSubmit() {
    const startDate = this.dateForm?.value.startDate
      ? this.convertToZTime(this.dateForm?.value.startDate)
      : null;

    const endDateValue = this.dateForm?.value.endDate;
    let endDate = null;

    if (endDateValue) {
      const modifiedEndDate = new Date(endDateValue);

      /**
       * End dates come in at midnight, so if you pick May 5, you don't get events
       * from May 5. Bumping it to 23:59:59.999 fixes this
       */
      modifiedEndDate.setHours(23, 59, 59, 999);
      endDate = this.convertToZTime(modifiedEndDate);
    }

    this.dateFormSubmission.emit({
      cursor: null,
      start: startDate,
      end: endDate,
    });
  }
}
