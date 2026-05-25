import { NgTemplateOutlet } from "@angular/common";
import { Component, inject, Input, input, output, signal } from "@angular/core";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatNativeDateModule, MatOptionModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatInputModule } from "@angular/material/input";
import { MatSelectChange, MatSelectModule } from "@angular/material/select";
import { MatButtonToggleChange, MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatTooltipModule } from "@angular/material/tooltip";

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
    MatButtonToggleModule,
    MatTooltipModule,
    NgTemplateOutlet,
  ],
  templateUrl: "./data-filter-bar.component.html",
  styleUrls: ["./data-filter-bar.component.scss"],
})
export class DataFilterBarComponent {
  @Input() sortForm?: FormGroup;
  readonly sorts = input<
    {
      param: string;
      display: string;
    }[]
  >();
  currentStatsPeriod = input<"24h" | "14d">()
  @Input() environmentForm?: FormGroup;
  @Input() searchForm?: FormGroup;
  protected breakPointObserver = inject(BreakpointObserver);
  readonly organizationEnvironments = input<string[]>([]);
  statsPeriodToggleDisabled = input(true)
  onStatsPeriodToggle = output<"24h" | "14d">()

  readonly filterByEnvironment = output<MatSelectChange>();
  readonly searchSubmit = output();
  readonly sortByChanged = output<MatSelectChange>();

  isLargeScreen = signal(true);

  constructor() {
    this.breakPointObserver
      .observe([Breakpoints.Medium, Breakpoints.Small, Breakpoints.XSmall])
      .subscribe((result) => {
        if (result.matches) {
          this.isLargeScreen.set(false);
        } else {
          this.isLargeScreen.set(true);
        }
      });
  }

  emitOnStatsPeriodToggle(event: MatButtonToggleChange) {
    this.onStatsPeriodToggle.emit(event.value)
  }
}
