import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";
import { RouterLink, QueryParamsHandling } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { components } from "src/app/api/api-schema";
import { PanelComponent } from "src/app/shared/panel/panel.component";
import { ListComponent } from "src/app/shared/list/list.component";
import { ListRowComponent } from "src/app/shared/list/list-row.component";
import { ListRowLinkComponent } from "src/app/shared/list/list-row-link.component";
import { EmptyStateComponent } from "src/app/shared/empty-state/empty-state.component";
import { AlertRecipientsComponent } from "../alert-recipients/alert-recipients.component";
import { AlertSummaryComponent } from "../alert-summary/alert-summary.component";
import { alertName } from "../alert-labels";

type ListedAlert = components["schemas"]["ProjectAlertSchema"];

/** A project's alerts in one panel, for the project and monitor Alerts tabs. */
@Component({
  selector: "gt-alert-list",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgTemplateOutlet,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    PanelComponent,
    ListComponent,
    ListRowComponent,
    ListRowLinkComponent,
    EmptyStateComponent,
    AlertRecipientsComponent,
    AlertSummaryComponent,
  ],
  template: `
    <ng-template #newAlert>
      <a
        mat-stroked-button
        id="create-new-alert"
        [routerLink]="link()"
        [queryParams]="newParams()"
        [queryParamsHandling]="paramsHandling()"
      >
        <mat-icon>add</mat-icon>
        <ng-container i18n>New alert</ng-container>
      </a>
    </ng-template>
    @if (alerts().length) {
      <!-- No title: it would repeat the tab. -->
      <gt-panel flush>
        <span slot="lead">
          @if (projectName(); as projectName) {
            <ng-container i18n
              >{alerts().length, plural,
                =1 {1 alert}
                other {{{ alerts().length // i18n(ph="count") }} alerts}
              }
              from {{ projectName // i18n(ph="project") }}</ng-container
            >
          } @else {
            <ng-container i18n>{alerts().length, plural,
              =1 {1 alert}
              other {{{ alerts().length // i18n(ph="count") }} alerts}
            }</ng-container>
          }
        </span>
        @if (canWrite()) {
          <ng-container slot="actions">
            <ng-container [ngTemplateOutlet]="newAlert" />
          </ng-container>
        }
        <gt-list flush>
          @for (row of rows(); track row.alert.id) {
            <gt-list-row>
              @if (canWrite()) {
                <a
                  gtListRowLink
                  [routerLink]="link()"
                  [queryParams]="row.params"
                  [queryParamsHandling]="paramsHandling()"
                  >{{ row.name }}</a
                >
              } @else {
                <span>{{ row.name }}</span>
              }
              <gt-alert-recipients
                [recipients]="row.alert.alertRecipients"
                [teams]="teams()"
              />
              <gt-alert-summary slot="description" [alert]="row.alert" />
            </gt-list-row>
          }
        </gt-list>
      </gt-panel>
    } @else {
      <gt-panel>
        <gt-empty-state
          icon="notifications"
          [title]="emptyTitle()"
          [message]="emptyMessage()"
        >
          @if (canWrite()) {
            <ng-container [ngTemplateOutlet]="newAlert" />
          }
        </gt-empty-state>
      </gt-panel>
    }
  `,
})
export class AlertListComponent {
  readonly alerts = input.required<ListedAlert[]>();
  readonly teams = input<string[]>();
  readonly canWrite = input(false, { transform: booleanAttribute });
  /** Where the alert form lives; rows and New alert add ?alert=. */
  readonly link = input<unknown[]>([]);
  /** Query params kept on every link, such as the project tab. */
  readonly linkParams = input<Record<string, unknown>>({});
  readonly paramsHandling = input<QueryParamsHandling | null>(null);
  readonly emptyTitle = input.required<string>();
  readonly emptyMessage = input("");
  /** For another page's project's alerts: "2 alerts from checkout-api". */
  readonly projectName = input<string | null>(null);

  readonly newParams = computed(() => ({ ...this.linkParams(), alert: "new" }));
  readonly rows = computed(() =>
    this.alerts().map((alert) => ({
      alert,
      name: alertName(alert),
      params: { ...this.linkParams(), alert: alert.id },
    })),
  );
}
