import { formatDate } from "@angular/common";
import {
  Component,
  ChangeDetectionStrategy,
  effect,
  inject,
  input,
  computed,
} from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { MatOptionSelectionChange } from "@angular/material/core";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatDialog } from "@angular/material/dialog";
import { MatSelectModule, MatSelectChange } from "@angular/material/select";
import {
  CustomTimeRangeForm,
  CustomTimeRangeOutput,
} from "./custom-timerange-form/custom-time-range-form";
import { DateRange } from "@angular/material/datepicker";

const NO_FILTER_TEXT = $localize`All times`;

@Component({
  standalone: true,
  selector: "gt-time-range-select",
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
],
  templateUrl: "./time-range-select.html",
  styleUrl: "./time-range-select.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimeRangeSelect {
  protected router = inject(Router);
  dialog = inject(MatDialog);
  timeRangePresets = [
    { display: NO_FILTER_TEXT, value: "" },
    { display: $localize`Last hour`, value: "now-1h" },
    { display: $localize`Last 24 hours`, value: "now-1d" },
    { display: $localize`Last 7 days`, value: "now-7d" },
    { display: $localize`Last 14 days`, value: "now-14d" },
    { display: $localize`Last 30 days`, value: "now-30d" },
  ];
  queriedTimeRangeStart = input<string | undefined>();
  queriedTimeRangeEnd = input<string | undefined>();
  presetRangeForm = new FormControl<string | null>("");
  queriedPresetTimeRange = computed(() => {
    const presetValues = this.timeRangePresets.map((preset) => preset.value);
    const start = this.queriedTimeRangeStart();
    const end = this.queriedTimeRangeEnd();
    if (start && presetValues.includes(start) && (!end || end === "now")) {
      return start;
    }
    if (!start && !end) {
      return "";
    }
    return null;
  });

  // Return a converted date if possible, otherwise just return
  // the string
  formatDateStringDisplay(dateString: string | undefined) {
    if (!dateString) {
      return "";
    }
    const convertedDate = new Date(dateString.replace("Z", ""));
    if (!isNaN(convertedDate.getTime())) {
      return formatDate(convertedDate, "MM/dd h:mm a", "en-us");
    } else {
      return dateString;
    }
  }

  queriedTimerangeDisplay = computed(() => {
    const queriedPreset = this.queriedPresetTimeRange();
    if (queriedPreset) {
      return this.timeRangePresets.find(
        (preset) => preset.value === queriedPreset,
      )?.display;
    }
    const formattedStart = this.formatDateStringDisplay(
      this.queriedTimeRangeStart(),
    );
    const formattedEnd = this.formatDateStringDisplay(
      this.queriedTimeRangeEnd(),
    );

    if (formattedStart && formattedEnd) {
      return formattedStart + " - " + formattedEnd;
    }

    if (formattedStart && !formattedEnd) {
      return formattedStart + " - now";
    }

    if (!formattedStart && formattedEnd) {
      return `Until ${formattedEnd}`;
    }

    return NO_FILTER_TEXT;
  });

  extendSelectSize = computed(
    () =>
      this.queriedTimerangeDisplay() &&
      this.queriedTimerangeDisplay()!.length > 14,
  );

  // For passing already-queried custom date range to
  // the custom timerange dialog.
  // If query includes valid, non-relative date times,
  // returned date range will include them. Otherwise,
  // they will be replaced with null values in the
  // returned date range
  queriedTimerangeParsed = computed(() => {
    const start = this.queriedTimeRangeStart()?.replace("Z", "");
    let startParsed: Date | null = new Date(start as any);
    startParsed = isNaN(startParsed.getDate()) ? null : startParsed;
    const end = this.queriedTimeRangeEnd()?.replace("Z", "");
    let endParsed: Date | null = new Date(end as any);
    endParsed = isNaN(endParsed.getDate()) ? null : endParsed;
    return new DateRange<Date>(startParsed, endParsed);
  });

  constructor() {
    effect(() => {
      const queriedPreset = this.queriedPresetTimeRange();
      if (queriedPreset !== null) {
        this.presetRangeForm.setValue(queriedPreset);
      }
    });
  }

  // The custom time range form tracks dates and start/end times separately,
  // so when we get them here we need to combine them
  private mergeDateTime(date: Date | null, time: Date | null) {
    if (date && time) {
      date.setHours(time.getHours());
      date.setMinutes(time.getMinutes());
      date.setSeconds(time.getSeconds());
      date.setMilliseconds(time.getMilliseconds());
    }
    return date;
  }

  private convertToZTime(date: Date) {
    return formatDate(date, "yyyy-MM-ddTHH:mm:ss.SSS", "en-US") + "Z";
  }

  openCustomTimerangeForm() {
    const dialogRef = this.dialog.open<
      CustomTimeRangeForm,
      unknown,
      CustomTimeRangeOutput
    >(CustomTimeRangeForm, { data: this.queriedTimerangeParsed() });
    dialogRef.afterClosed().subscribe((output) => {
      if (output) {
        const start = this.mergeDateTime(
          output.dateRange.start,
          output.startTime,
        );
        const end = this.mergeDateTime(output.dateRange.end, output.endTime);

        this.router.navigate([], {
          queryParams: {
            start: start ? this.convertToZTime(start) : undefined,
            end: end ? this.convertToZTime(end) : undefined,
          },
          queryParamsHandling: "merge",
        });
      }
    });
  }

  onPresetSelect(event: MatSelectChange<string | undefined>) {
    // Handled by onCustomRangeSelect
    if (event.value === "custom") {
      return;
    }
    this.router.navigate([], {
      queryParams: {
        cursor: null,
        start: this.presetRangeForm.value || undefined,
        end: undefined,
      },
      queryParamsHandling: "merge",
    });
  }

  onCustomRangeSelect(event: MatOptionSelectionChange) {
    if (event.isUserInput) {
      this.openCustomTimerangeForm();
    }
  }
}
