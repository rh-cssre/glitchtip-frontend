import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from "@angular/core";
import {
  MatNativeDateModule,
  provideNativeDateAdapter,
} from "@angular/material/core";
import { MatButton } from "@angular/material/button";
import {
  DateRange,
  MatCalendar,
  MatDatepickerModule,
} from "@angular/material/datepicker";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatTimepickerModule } from "@angular/material/timepicker";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import {
  DefaultMatCalendarRangeStrategy,
  MatRangeDateSelectionModel,
} from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { DatePipe } from "@angular/common";
import { SettingsService } from "src/app/api/settings.service";

export interface CustomTimeRangeOutput {
  dateRange: DateRange<Date>;
  startTime: Date | null;
  endTime: Date | null;
}

@Component({
  standalone: true,
  selector: "gt-custom-time-range-form",
  imports: [
    DatePipe,
    MatButton,
    MatCalendar,
    MatTimepickerModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    ReactiveFormsModule,
  ],
  providers: [
    provideNativeDateAdapter(),
    DefaultMatCalendarRangeStrategy,
    MatRangeDateSelectionModel,
  ],
  templateUrl: "./custom-time-range-form.html",
  styleUrl: "./custom-time-range-form.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomTimeRangeForm {
  readonly dialogRef = inject(
    MatDialogRef<CustomTimeRangeForm, CustomTimeRangeOutput>,
  );
  readonly queriedDateRange: DateRange<Date> | undefined =
    inject(MAT_DIALOG_DATA);
  protected settingsService = inject(SettingsService);

  generateDefaultTime(isEndTime: boolean = false) {
    const date = new Date();
    if (isEndTime) {
      date.setHours(23, 59, 59, 999);
    } else {
      date.setHours(0, 0, 0, 0);
    }
    return date;
  }
  getInputOrDefaultDateRange() {
    if (this.queriedDateRange?.start || this.queriedDateRange?.end) {
      return this.queriedDateRange;
    }
    return new DateRange<Date>(new Date(), new Date());
  }
  dateRangeCtrl = new FormControl<DateRange<Date>>(
    this.getInputOrDefaultDateRange(),
  );
  startTimeCtrl = new FormControl<Date>(
    this.queriedDateRange?.start ?? this.generateDefaultTime(),
    Validators.required,
  );
  endTimeCtrl = new FormControl<Date>(
    this.queriedDateRange?.end ?? this.generateDefaultTime(true),
    Validators.required,
  );
  customTimeRange = new FormGroup({
    dateRange: this.dateRangeCtrl,
    startTime: this.startTimeCtrl,
    endTime: this.endTimeCtrl,
  });

  serverTimeZone = this.settingsService.serverTimeZone;
  dateRangeHeader = computed(() => {
    let header = $localize`Date range`;
    if (this.serverTimeZone()) {
      header += ` (${this.serverTimeZone()})`;
    }
    return header + ":";
  });

  constructor(
    private readonly selectionModel: MatRangeDateSelectionModel<Date>,
    private readonly selectionStrategy: DefaultMatCalendarRangeStrategy<Date>,
  ) {}

  onCalendarChange(date: Date) {
    const selection = this.selectionModel.selection,
      newSelection = this.selectionStrategy.selectionFinished(date, selection);

    this.selectionModel.updateSelection(newSelection, this);
    const newDateRange = new DateRange<Date>(
      newSelection.start,
      newSelection.end,
    );
    this.dateRangeCtrl.setValue(newDateRange);
  }

  onSubmit() {
    if (this.customTimeRange.valid) {
      this.dialogRef.close({
        dateRange: this.dateRangeCtrl.value,
        startTime: this.startTimeCtrl.value,
        endTime: this.endTimeCtrl.value,
      });
      return;
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}
