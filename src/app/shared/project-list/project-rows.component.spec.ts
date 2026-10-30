// Type-only: declares the $localize global for the spec program. The runtime
// polyfill is already loaded by the test builder.
import type {} from "@angular/localize/init";
import { afterEach, describe, expect, it, vi } from "vitest";
import { TestBed } from "@angular/core/testing";
import { provideRouter } from "@angular/router";
import { client } from "src/app/shared/api/api";
import { DAYS, ProjectRowsComponent, toDays } from "./project-rows.component";

/**
 * stats_v2 is read hourly and summed per day here, because its daily interval
 * undercounts and a project filter drops empty hours instead of zeroing them.
 */
describe("toDays", () => {
  const start = new Date(2026, 9, 17);
  const hour = (day: number, h: number) =>
    new Date(2026, 9, 17 + day, h).toISOString();

  it("gives one bar per day, zero where no hour was returned", () => {
    const days = toDays({ intervals: [], groups: [{ series: {} }] }, start);
    expect(days.length).toBe(DAYS);
    expect(days.every((d) => d.value === 0)).toBe(true);
  });

  it("sums every hour of a day, not only the first", () => {
    const days = toDays(
      {
        intervals: [hour(2, 0), hour(2, 9), hour(2, 23), hour(3, 1)],
        groups: [{ series: { "sum(quantity)": [1, 5, null, 2] } }],
      },
      start,
    );
    expect(days[2].value).toBe(6);
    expect(days[3].value).toBe(2);
  });

  it("ignores hours outside the window", () => {
    const days = toDays(
      {
        intervals: [hour(-1, 12), hour(DAYS, 12)],
        groups: [{ series: { "sum(quantity)": [9, 9] } }],
      },
      start,
    );
    expect(days.reduce((sum, d) => sum + d.value, 0)).toBe(0);
  });
});

describe("ProjectRowsComponent", () => {
  function render(project: Partial<Record<string, unknown>>, settings = false) {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(ProjectRowsComponent);
    fixture.componentRef.setInput("orgSlug", "acme");
    fixture.componentRef.setInput("opensSettings", settings);
    fixture.componentRef.setInput("projects", [
      {
        id: 7,
        name: "infra-cron",
        slug: "infra-cron",
        platform: "python-django",
        firstEvent: null,
        isMember: true,
        teams: [{ id: 1, slug: "platform" }],
        ...project,
      },
    ]);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it("names the platform and teams, and marks a project with no events", () => {
    const el = render({});
    expect(el.textContent).toContain("Django");
    expect(el.textContent).toContain("#platform");
    expect(el.querySelector("gt-status-pill")?.textContent).toContain(
      "No events yet",
    );
  });

  it("opens a project's issues, or its settings in the settings list", () => {
    const link = (el: HTMLElement) =>
      el.querySelector("a[gtListRowLink]")!.getAttribute("href");
    expect(link(render({}))).toBe("/acme/issues?project=7");
    TestBed.resetTestingModule();
    expect(link(render({}, true))).toBe("/acme/settings/projects/infra-cron");
  });

  it("does not link a project the user is not a member of", () => {
    const el = render({ isMember: false });
    expect(el.querySelector("a[gtListRowLink]")).toBeNull();
    expect(el.textContent).toContain("Not a member");
  });

  describe("in the settings list", () => {
    afterEach(() => vi.restoreAllMocks());

    async function renderSettings(alertCount: number) {
      vi.spyOn(client, "GET").mockResolvedValue({
        data: Array.from({ length: alertCount }, (_, id) => ({ id })),
        response: new Response(null, { status: 200 }),
      } as never);
      TestBed.configureTestingModule({ providers: [provideRouter([])] });
      const fixture = TestBed.createComponent(ProjectRowsComponent);
      fixture.componentRef.setInput("orgSlug", "acme");
      fixture.componentRef.setInput("opensSettings", true);
      fixture.componentRef.setInput("showTrend", false);
      fixture.componentRef.setInput("projects", [
        {
          id: 7,
          name: "api",
          slug: "api",
          firstEvent: "2026-10-22",
          isMember: true,
        },
      ]);
      fixture.detectChanges();
      const text = () => {
        fixture.detectChanges();
        return (fixture.nativeElement as HTMLElement).textContent ?? "";
      };
      // The row loads after it is seen, so wait for the request to resolve.
      await vi.waitFor(() => expect(client.GET).toHaveBeenCalled());
      await new Promise((done) => setTimeout(done));
      return text();
    }

    it("shows the alert count once the row loads", async () => {
      expect(await renderSettings(3)).toContain("3 alerts");
    });

    it("says nothing about alerts when there are none", async () => {
      expect(await renderSettings(0)).not.toContain("alert");
    });
  });
});
