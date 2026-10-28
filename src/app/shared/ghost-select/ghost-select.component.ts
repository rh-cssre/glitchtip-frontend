import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
  signal,
} from "@angular/core";
import { MatSelectModule } from "@angular/material/select";

export interface GhostSelectOption {
  value: string;
  label: string;
}

/** A 32px ghost select (.gt-select-ghost) for a view switch in a bar or panel header. */
@Component({
  selector: "gt-ghost-select",
  imports: [MatSelectModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      class="gt-select-ghost"
      [class.gt-select-ghost--open]="open()"
      [style.width.px]="width()"
      (click)="$event.target === $event.currentTarget && select.open()"
    >
      <mat-select
        #select
        [value]="value()"
        [aria-label]="label()"
        [panelWidth]="null"
        hideSingleSelectionIndicator
        (valueChange)="value.set($event)"
        (openedChange)="open.set($event)"
      >
        <mat-select-trigger>
          <span class="gt-select-ghost__value">
            <span class="gt-ghost-select__long">{{ current() }}</span>
            @if (shortLabel()) {
              <span class="gt-ghost-select__short">{{ shortLabel() }}</span>
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
    :host {
      display: inline-flex;
      flex: none;
    }

    .gt-ghost-select__short {
      display: none;
    }

    @container (max-width: 599px) {
      .gt-ghost-select__long:has(+ .gt-ghost-select__short) {
        display: none;
      }

      .gt-ghost-select__short {
        display: inline;
      }
    }
  `,
})
export class GhostSelectComponent {
  readonly options = input.required<GhostSelectOption[]>();
  readonly value = model.required<string>();
  /** Accessible name; the trigger shows the selected label. */
  readonly label = input.required<string>();
  readonly width = input<number | null>(null);
  /** Trigger text under a 600px container, such as "Raw" for "Raw trace". */
  readonly shortLabel = input("");
  readonly open = signal(false);
  readonly current = computed(
    () => this.options().find((o) => o.value === this.value())?.label ?? "",
  );
}
