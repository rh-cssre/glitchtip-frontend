import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
} from "@angular/core";
import { MatSelectModule } from "@angular/material/select";
import { SelectGhostDirective } from "../select-ghost.directive";

export interface GhostSelectOption {
  value: string;
  label: string;
}

/** A 32px ghost select (.gt-select-ghost) for a view switch in a bar or panel header. */
@Component({
  selector: "gt-ghost-select",
  imports: [MatSelectModule, SelectGhostDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span gtSelectGhost [style.width.px]="width()">
      <mat-select
        [value]="value()"
        [aria-label]="ariaLabel()"
        [panelWidth]="null"
        hideSingleSelectionIndicator
        (valueChange)="value.set($event)"
      >
        <mat-select-trigger>
          <span class="gt-select-ghost__value">
            <span class="gt-select-ghost__long">{{ current() }}</span>
            @if (shortLabel()) {
              <span class="gt-select-ghost__short">{{ shortLabel() }}</span>
            }
          </span>
        </mat-select-trigger>
        @for (o of options(); track o.value) {
          <mat-option [value]="o.value">{{ o.label }}</mat-option>
        }
      </mat-select>
    </span>
  `,
  styles: `
    @use "controls";

    :host {
      display: inline-flex;
      flex: none;
    }

    .gt-select-ghost__short {
      display: none;
    }

    @include controls.narrow-bar {
      .gt-select-ghost__long:has(+ .gt-select-ghost__short) {
        display: none;
      }

      .gt-select-ghost__short {
        display: inline;
      }
    }
  `,
})
export class GhostSelectComponent {
  readonly options = input.required<GhostSelectOption[]>();
  readonly value = model.required<string>();
  /** The trigger shows only the value, so the select needs its own name. */
  readonly ariaLabel = input.required<string>();
  readonly width = input<number | null>(null);
  /** Trigger text in a bar under 600px, such as "Raw" for "Raw trace". */
  readonly shortLabel = input("");
  protected readonly current = computed(
    () => this.options().find((o) => o.value === this.value())?.label ?? "",
  );
}
