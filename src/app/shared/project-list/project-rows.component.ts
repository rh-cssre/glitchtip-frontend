import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  input,
  resource,
} from "@angular/core";
import { DecimalPipe } from "@angular/common";
import { RouterLink } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { client } from "src/app/shared/api/api";
import { getPaginationHeaders } from "src/app/shared/pagination.utils";
import { DaysAgoPipe } from "src/app/shared/days-ago.pipe";
import { IssueChart } from "src/app/issues/issues-page/charts/issue-chart";
import { FormattedStatsDataPoint } from "src/app/issues/interfaces";
import { platforms } from "src/app/settings/projects/new-project/platform-picker/platforms";
import { ListComponent } from "../list/list.component";
import { ListRowComponent } from "../list/list-row.component";
import { ListRowLinkComponent } from "../list/list-row-link.component";
import { PanelComponent } from "../panel/panel.component";

/** What a row shows; both the org and the all-projects APIs provide it. */
interface ProjectRow {
  id: string | number;
  name: string;
  slug?: string | null;
  platform?: string | null;
  firstEvent?: string | null;
  isMember: boolean;
  teams?: { id: string | number; slug: string }[];
}

interface Glance {
  days: FormattedStatsDataPoint[];
  unresolved: number;
  lastSeen: string | null;
}

const platformNames = new Map(
  platforms.flatMap((p) => [
    [p.id, p.name] as const,
    ...p.integrations.map((i) => [i.id, i.name] as const),
  ]),
);

/** A flat list of projects with each one's last 14 days at a glance. */
@Component({
  selector: "gt-project-rows",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
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
    PanelComponent,
  ],
  template: `
    @let glances = glance.value();
    <gt-panel flush>
      <gt-list flush>
        @for (project of projects(); track project.id) {
          @let g = glances?.get(project.id.toString());
          <gt-list-row>
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
            <span slot="description" class="list-row__facts">
              @if (platformName(project.platform); as platform) {
                <span>{{ platform }}</span>
              }
              @for (team of project.teams ?? []; track team.id) {
                <span>#{{ team.slug }}</span>
              }
              @if (!project.firstEvent) {
                <span i18n>waiting for first event</span>
              } @else if (g?.lastSeen; as lastSeen) {
                <span i18n
                  >last event {{ lastSeen | daysAgo // i18n(ph="time") }}</span
                >
              }
            </span>
            @if (g) {
              <!-- One item, so the meta slot draws no dot between chart and count -->
              <span slot="meta"
                ><span class="glance">
                  <gt-issue-chart
                    class="glance__chart"
                    [formattedStats]="g.days"
                    [statsChartDataFrame]="[]"
                    statsPeriod="14d"
                    [serverTimeZone]="timeZone"
                    [loading]="false"
                  />
                  <span class="glance__count" i18n
                    ><b>{{ g.unresolved | number // i18n(ph="count") }}</b>
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
  readonly timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  /** Only projects that have had events get a glance; the rest are waiting. */
  protected readonly glance = resource({
    params: () => ({
      org: this.orgSlug(),
      ids: this.projects()
        .filter((p) => p.firstEvent)
        .map((p) => +p.id),
    }),
    loader: async ({ params }) =>
      new Map(
        await Promise.all(
          params.ids.map(
            async (id) =>
              [String(id), await loadGlance(params.org, id)] as const,
          ),
        ),
      ),
  });

  platformName(id?: string | null) {
    return (id && platformNames.get(id)) || null;
  }

  settingsLabel(name: string) {
    return $localize`${name}:project: settings`;
  }
}

export const DAYS = 14;
const localDay = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

interface StatsV2 {
  intervals: string[];
  groups: { series: Record<string, (number | null)[]> }[];
}

async function loadGlance(org: string, project: number): Promise<Glance> {
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
  return {
    days: toDays(stats.data as StatsV2 | undefined, start),
    unresolved: getPaginationHeaders(unresolved.response).hits,
    lastSeen: latest.data?.[0]?.lastSeen ?? null,
  };
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
