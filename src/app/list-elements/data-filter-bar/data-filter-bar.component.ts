import { NgTemplateOutlet } from "@angular/common";
import {
  Component,
  inject,
  Input,
  input,
  output,
  signal,
  ChangeDetectionStrategy,
} from "@angular/core";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatNativeDateModule, MatOptionModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatInputModule } from "@angular/material/input";
import { MatSelectChange, MatSelectModule } from "@angular/material/select";
import {
  MatButtonToggleChange,
  MatButtonToggleModule,
} from "@angular/material/button-toggle";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatIconModule } from "@angular/material/icon";
import { MatChipsModule } from "@angular/material/chips";
import { MatMenuModule } from "@angular/material/menu";

export interface SearchHelpSection {
  title: string;
  // Clickable chips — use for bounded enums (status, level).
  examples?: string[];
  // Inline code samples — use when values are unbounded (tags, free text).
  samples?: string[];
  note?: string;
  // When true, clicking a chip replaces any same-prefix token (e.g. is:*).
  mutuallyExclusive?: boolean;
}

export interface SearchHelpConfig {
  heading: string;
  sections: SearchHelpSection[];
  footer?: string;
}

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
    MatIconModule,
    MatChipsModule,
    MatMenuModule,
    NgTemplateOutlet,
  ],
  templateUrl: "./data-filter-bar.component.html",
  changeDetection: ChangeDetectionStrategy.Eager,
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
  currentStatsPeriod = input<"24h" | "14d">();
  @Input() environmentForm?: FormGroup;
  @Input() searchForm?: FormGroup;
  readonly searchHelp = input<SearchHelpConfig>();
  protected breakPointObserver = inject(BreakpointObserver);
  readonly organizationEnvironments = input<string[]>([]);
  statsPeriodToggleDisabled = input(true);
  onStatsPeriodToggle = output<"24h" | "14d">();

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
    this.onStatsPeriodToggle.emit(event.value);
  }

  isTokenActive(token: string): boolean {
    const current = ((this.searchForm?.get("query")?.value ?? "") as string).trim();
    if (!current) return false;
    return current.split(/\s+/).includes(token);
  }

  toggleSearchToken(token: string, mutuallyExclusive = false) {
    const control = this.searchForm?.get("query");
    if (!control) return;
    const tokens = ((control.value ?? "") as string).trim().split(/\s+/).filter(Boolean);

    if (tokens.includes(token)) {
      control.setValue(tokens.filter((t) => t !== token).join(" "));
    } else {
      const prefix = token.split(":")[0];
      const isStructured = token.includes(":");
      const kept = mutuallyExclusive
        ? tokens.filter((t) => !t.includes(":") || t.split(":")[0] !== prefix)
        : tokens;
      // Structured tokens go before bare words; the backend stops parsing
      // filters after the first plain word.
      const firstBareIdx = isStructured ? kept.findIndex((t) => !t.includes(":")) : -1;
      const next = firstBareIdx < 0
        ? [...kept, token]
        : [...kept.slice(0, firstBareIdx), token, ...kept.slice(firstBareIdx)];
      control.setValue(next.join(" "));
    }

    this.searchSubmit.emit();
  }
}
