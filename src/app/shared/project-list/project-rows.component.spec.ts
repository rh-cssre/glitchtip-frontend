// Type-only: declares the $localize global for the spec program. The runtime
// polyfill is already loaded by the test builder.
import type {} from "@angular/localize/init";
import { describe, expect, it } from "vitest";
import { TestBed } from "@angular/core/testing";
import { provideRouter } from "@angular/router";
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

  it("names the platform and teams, and waits for a first event", () => {
    const text = render({}).textContent ?? "";
    expect(text).toContain("Django");
    expect(text).toContain("#platform");
    expect(text).toContain("waiting for first event");
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
});
