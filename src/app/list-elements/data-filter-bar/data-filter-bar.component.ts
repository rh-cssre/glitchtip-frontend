import { CommonModule, formatDate } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatNativeDateModule, MatOptionModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatInputModule } from "@angular/material/input";
import { MatSelectChange, MatSelectModule } from "@angular/material/select";

@Component({
  standalone: true,
  selector: "gt-data-filter-bar",
  imports: [
    CommonModule,
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
  @Input() sorts?: { param: string; display: string }[];
  @Input() environmentForm?: FormGroup;
  @Input() searchForm?: FormGroup;
  @Input() organizationEnvironments: string[] = [];

  @Output() dateFormSubmission = new EventEmitter<object>();
  @Output() dateFormReset = new EventEmitter();
  @Output() filterByEnvironment = new EventEmitter<MatSelectChange>();
  @Output() searchSubmit = new EventEmitter();
  @Output() sortByChanged = new EventEmitter<MatSelectChange>();

  constructor() {}

  convertToZTime(date: Date) {
    return formatDate(date, "yyyy-MM-ddTHH:mm:ss.SSS", "en-US") + "Z";
  }

  onDateFormSubmit() {
    const startDate = this.dateForm?.value.startDate
      ? this.convertToZTime(this.dateForm?.value.startDate)
      : null;

    /**
     * End dates come in at midnight, so if you pick May 5, you don't get events
     * from May 5. Bumping it to 23:59:59.999 fixes this
     */
    const modifiedEndDate = this.dateForm?.value.endDate
      ? this.dateForm.value.endDate.getTime() + 86399999
      : null;
    const endDate = modifiedEndDate
      ? this.convertToZTime(modifiedEndDate)
      : null;
    this.dateFormSubmission.emit({
      cursor: null,
      start: startDate,
      end: endDate,
    });
  }
}
