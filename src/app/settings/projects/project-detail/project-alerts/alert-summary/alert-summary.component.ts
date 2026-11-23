import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from "@angular/core";
import { AlertConditions } from "../alert-labels";

/**
 * Says when an alert fires, in whole sentences. Pass `recipients` for a draft
 * to also say who gets it.
 */
@Component({
  selector: "gt-alert-summary",
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @let a = alert();
    @let quantity = a.quantity ?? 0;
    @let timespan = a.timespanMinutes ?? 0;
    @let events = !!(quantity && timespan);
    @let count = recipients();
    @if (events && a.uptime) {
      <ng-container i18n
        >Alerts when an issue gets
        {quantity, plural,
          =1 {1 event}
          other {{{ quantity // i18n(ph="quantity") }} events}
        }
        in
        {timespan, plural,
          =1 {1 minute}
          other {{{ timespan // i18n(ph="timespan") }} minutes}
        }
        or an uptime monitor goes down.</ng-container
      >
    } @else if (events) {
      <ng-container i18n
        >Alerts when an issue gets
        {quantity, plural,
          =1 {1 event}
          other {{{ quantity // i18n(ph="quantity") }} events}
        }
        in
        {timespan, plural,
          =1 {1 minute}
          other {{{ timespan // i18n(ph="timespan") }} minutes}

        }.</ng-container
      >
    } @else if (a.uptime) {
      <ng-container i18n>Alerts when an uptime monitor goes down.</ng-container>
    } @else if (count !== null) {
      <ng-container i18n>Pick at least one trigger above.</ng-container>
    } @else {
      <ng-container i18n>Never alerts: no trigger is set.</ng-container>
    }
    @if (environmentSentence() && (events || a.uptime || count === null)) {
      &ngsp;{{ environmentSentence() }}
    }
    @if (count !== null && (events || a.uptime)) {
      &ngsp;<ng-container i18n>{count, plural,
        =0 {Nobody is notified until you add a recipient.}
        =1 {Notifies 1 recipient.}
        other {Notifies {{ count // i18n(ph="count") }} recipients.}
      }</ng-container>
    }
  `,
})
export class AlertSummaryComponent {
  readonly alert = input.required<AlertConditions>();
  /** The draft's recipient count; null for a saved alert in a list. */
  readonly recipients = input<number | null>(null);

  readonly environmentSentence = computed(() => {
    const environments = this.alert().environments;
    if (!environments?.length) return "";
    const envs = new Intl.ListFormat(
      document.documentElement.lang || undefined,
      {
        type: "disjunction",
      },
    ).format(environments);
    return $localize`Only in ${envs}:environments:.`;
  });
}
