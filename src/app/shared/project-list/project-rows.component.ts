import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
} from "@angular/core";
import { DatePipe, DecimalPipe } from "@angular/common";
import { RouterLink } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { client } from "src/app/shared/api/api";
import { getPaginationHeaders } from "src/app/shared/pagination.utils";
import { limitConcurrency } from "src/app/shared/async.utils";
import { DaysAgoPipe } from "src/app/shared/days-ago.pipe";
import { OnVisibleDirective } from "src/app/shared/on-visible.directive";
import { IssueChart } from "src/app/issues/issues-page/charts/issue-chart";
import { FormattedStatsDataPoint } from "src/app/issues/interfaces";
import { platforms } from "src/app/settings/projects/new-project/platform-picker/platforms";
import { ListComponent } from "../list/list.component";
import { ListRowComponent } from "../list/list-row.component";
import { ListRowLinkComponent } from "../list/list-row-link.component";
import { PanelComponent } from "../panel/panel.component";
import { StatusPillComponent } from "../status-pill/status-pill.component";

/** What a row shows; both the org and the all-projects APIs provide it. */
interface ProjectRow {
  id: string | number;
  name: string;
  slug?: string | null;
  platform?: string | null;
  firstEvent?: string | null;
  dateCreated?: string | null;
  isMember: boolean;
  teams?: { id: string | number; slug: string }[];
}

/** A row's own numbers: the trend facts on Projects, the alert count in settings. */
interface RowFacts {
  days?: FormattedStatsDataPoint[];
  unresolved?: number;
  lastSeen?: string | null;
  alerts?: number;
}

type RowState = "loading" | "failed" | RowFacts;

const platformNames = new Map(
  platforms.flatMap((p) => [
    [p.id, p.name] as const,
    ...p.integrations.map((i) => [i.id, i.name] as const),
  ]),
);

const SKELETON_BARS = Array.from({ length: 14 }, (_, i) => i);

/** A flat list of projects, each with its own facts loaded once it scrolls into view. */
@Component({
  selector: "gt-project-rows",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    DecimalPipe,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    DaysAgoPipe,
    IssueChart,
    ListComponent,
    ListRowComponent,
    ListRowLinkComponent,
    OnVisibleDirective,
    PanelComponent,
    StatusPillComponent,
  ],
  template: `
    <gt-panel flush>
      <gt-list flush>
        @for (project of projects(); track project.id) {
          @let state = rows().get(key(project));
          @let facts = factsOf(state);
          <gt-list-row (gtOnVisible)="load(project)">
            @if (project.isMember || opensSettings()) {
              <a
                gtListRowLink
                [routerLink]="
                  opensSettings()
                    ? ['/', orgSlug(), 'settings', 'projects', project.slug]
                    : ['/', orgSlug(), 'issues']
                "
                [queryParams]="opensSettings() ? {} : { project: project.id }"
                >{{ project.name }}</a
              >
            } @else {
              <span>{{ project.name }}</span>
              <span class="list-row__tag" i18n>Not a member</span>
            }
            @if (!project.firstEvent) {
              <gt-status-pill [label]="noEventsText" />
            }
            <span slot="description" class="list-row__facts">
              @if (platformName(project.platform); as platform) {
                <span>{{ platform }}</span>
              }
              @for (team of project.teams ?? []; track team.id) {
                <span>#{{ team.slug }}</span>
              }
              @if (facts?.lastSeen; as lastSeen) {
                <span i18n
                  >last event {{ lastSeen | daysAgo // i18n(ph="time") }}</span
                >
              }
            </span>
            @if (!showTrend()) {
              <span slot="meta">
                @if (facts?.alerts; as alerts) {
                  <span i18n>{alerts, plural,
                    =1 {1 alert}
                    other {{{ alerts // i18n(ph="count") }} alerts}
                  }</span>
                }
                @if (project.dateCreated) {
                  <span i18n
                    >Created
                    {{
                      project.dateCreated
                        | date: "mediumDate" // i18n(ph="date")
                    }}</span
                  >
                }
              </span>
            } @else if (project.firstEvent) {
              <!-- One item, so the meta slot draws no dot between chart and count -->
              <span slot="meta"
                ><span class="glance">
                  @if (facts?.days; as days) {
                    <gt-issue-chart
                      class="glance__chart"
                      [formattedStats]="days"
                      [statsChartDataFrame]="[]"
                      statsPeriod="14d"
                      [serverTimeZone]="timeZone"
                      [loading]="false"
                    />
                  } @else {
                    <span
                      class="glance__chart glance__skeleton"
                      [class.glance__skeleton--loading]="state !== 'failed'"
                      aria-hidden="true"
                    >
                      @for (bar of skeletonBars; track bar) {
                        <span></span>
                      }
                    </span>
                  }
                  <span class="glance__count" i18n
                    ><b>{{
                      facts?.unresolved === undefined
                        ? "–"
                        : (facts!.unresolved | number) // i18n(ph="count")
                    }}</b>
                    unresolved</span
                  >
                </span></span
              >
            }
            @if (!opensSettings() && canEdit()) {
              <a
                slot="actions"
                mat-icon-button
                class="medium-icon-button"
                [routerLink]="[
                  '/',
                  orgSlug(),
                  'settings',
                  'projects',
                  project.slug,
                ]"
                [attr.aria-label]="settingsLabel(project.name)"
                [matTooltip]="settingsLabel(project.name)"
              >
                <mat-icon>settings</mat-icon>
              </a>
            }
          </gt-list-row>
        }
      </gt-list>
    </gt-panel>
  `,
  styles: `
    @use "variables" as vars;

    .glance {
      display: flex;
      align-items: center;
      gap: var(--gt-space-5, 24px);
    }

    .glance__count {
      min-width: 11ch;
      white-space: nowrap;
      font-variant-numeric: tabular-nums;

      b {
        font-weight: 600;
        color: var(--mat-sys-on-surface);
      }
    }

    // Same box as the chart, so nothing moves when the bars arrive.
    .glance__skeleton {
      display: flex;
      align-items: flex-end;
      justify-content: space-around;
      box-sizing: border-box;
      width: 300px;
      height: 40px;
      padding-bottom: 12px;

      > span {
        width: 3px;
        height: 6px;
        border-radius: 1px;
        background-color: var(--mat-sys-outline-variant);
      }
    }

    .glance__skeleton--loading > span {
      animation: glance-pulse 1.2s ease-in-out infinite alternate;

      @media (prefers-reduced-motion: reduce) {
        animation: none;
      }
    }

    @keyframes glance-pulse {
      to {
        opacity: 0.4;
      }
    }

    // Phones keep the count; the trend needs more room than they have.
    @media screen and (max-width: vars.$small - 1) {
      .glance__chart {
        display: none;
      }
    }
  `,
})
export class ProjectRowsComponent {
  readonly projects = input.required<ProjectRow[]>();
  readonly orgSlug = input.required<string>();
  /** Rows open the project's settings, not its issues (the settings list). */
  readonly opensSettings = input(false, { transform: booleanAttribute });
  readonly canEdit = input(false);
  /** The 14-day trend and counts; the settings list shows setup facts instead. */
  readonly showTrend = input(true, { transform: booleanAttribute });

  readonly timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  readonly noEventsText = $localize`No events yet`;
  readonly skeletonBars = SKELETON_BARS;

  protected readonly rows = signal(new Map<string, RowState>());
  // At most four projects load at once, so a long list cannot flood the API.
  private readonly queue = limitConcurrency(4);

  key(project: ProjectRow) {
    return `${this.orgSlug()}/${project.id}`;
  }

  factsOf(state: RowState | undefined): RowFacts | null {
    return typeof state === "object" ? state : null;
  }

  /** Loads a row's facts the first time it comes into view. */
  load(project: ProjectRow) {
    const key = this.key(project);
    const trend = this.showTrend();
    if (this.rows().has(key) || (trend && !project.firstEvent)) return;
    this.set(key, "loading");
    const org = this.orgSlug();
    this.queue(() =>
      trend
        ? loadTrend(org, +project.id)
        : loadAlertCount(org, project.slug ?? ""),
    ).then(
      (facts) => this.set(key, facts),
      () => this.set(key, "failed"),
    );
  }

  platformName(id?: string | null) {
    return (id && platformNames.get(id)) || null;
  }

  settingsLabel(name: string) {
    return $localize`${name}:project: settings`;
  }

  private set(key: string, state: RowState) {
    this.rows.update((rows) => new Map(rows).set(key, state));
  }
}

export const DAYS = 14;
const localDay = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

interface StatsV2 {
  intervals: string[];
  groups: { series: Record<string, (number | null)[]> }[];
}

async function loadTrend(org: string, project: number): Promise<RowFacts> {
  const path = { organization_id_or_slug: org };
  const end = new Date();
  const start = new Date(localDay(end) - (DAYS - 1) * 864e5);
  const [stats, unresolved, latest] = await Promise.all([
    // Hourly, summed per day here: the daily interval only counts each day's first hour.
    client.GET("/api/0/organizations/{organization_id_or_slug}/stats_v2/", {
      params: {
        path,
        query: {
          category: "error",
          interval: "1h",
          field: "sum(quantity)",
          project: [project],
          start: start.toISOString(),
          end: end.toISOString(),
        },
      },
    }),
    client.GET("/api/0/organizations/{organization_id_or_slug}/issues/", {
      params: {
        path,
        query: { project: [project], query: "is:unresolved", limit: 1 },
      },
    }),
    client.GET("/api/0/organizations/{organization_id_or_slug}/issues/", {
      params: {
        path,
        query: { project: [project], sort: "-last_seen", limit: 1 },
      },
    }),
  ]);
  if (!stats.response.ok || !unresolved.response.ok) {
    throw new Error("project trend failed to load");
  }
  return {
    days: toDays(stats.data as StatsV2 | undefined, start),
    unresolved: getPaginationHeaders(unresolved.response).hits,
    lastSeen: latest.data?.[0]?.lastSeen ?? null,
  };
}

async function loadAlertCount(org: string, slug: string): Promise<RowFacts> {
  const { data, response } = await client.GET(
    "/api/0/projects/{organization_id_or_slug}/{project_slug}/alerts/",
    { params: { path: { organization_id_or_slug: org, project_slug: slug } } },
  );
  if (!response.ok) throw new Error("project alerts failed to load");
  return { alerts: data?.length ?? 0 };
}

/** One bar per local day; missing hours count as zero. */
export function toDays(
  stats: StatsV2 | undefined,
  start: Date,
): FormattedStatsDataPoint[] {
  const totals = new Map<number, number>();
  for (let i = 0; i < DAYS; i++) {
    totals.set(localDay(new Date(+start + i * 864e5)), 0);
  }
  const series = stats?.groups[0]?.series["sum(quantity)"] ?? [];
  stats?.intervals.forEach((at, i) => {
    const day = localDay(new Date(at));
    if (totals.has(day)) totals.set(day, totals.get(day)! + (series[i] ?? 0));
  });
  return [...totals].map(([timestamp, value]) => ({
    name: String(timestamp),
    timestamp,
    value,
  }));
}
