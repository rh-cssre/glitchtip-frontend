import { describe, expect, it } from "vitest";
import { TestBed } from "@angular/core/testing";
import { PanelComponent } from "./panel.component";

describe("PanelComponent", () => {
  function render(inputs: Record<string, unknown>) {
    const fixture = TestBed.createComponent(PanelComponent);
    for (const [key, value] of Object.entries(inputs)) {
      fixture.componentRef.setInput(key, value);
    }
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it("labels the region with its title heading", () => {
    const el = render({ title: "Span breakdown", headingLevel: 3 });
    const heading = el.querySelector('[role="heading"]')!;
    expect(heading.textContent?.trim()).toBe("Span breakdown");
    expect(heading.getAttribute("aria-level")).toBe("3");
    expect(el.getAttribute("role")).toBe("region");
    expect(el.getAttribute("aria-labelledby")).toBe(heading.id);
    expect(el.getAttribute("title")).toBeNull();
  });

  it("is not a region without a title", () => {
    const el = render({});
    expect(el.querySelector('[role="heading"]')).toBeNull();
    expect(el.getAttribute("role")).toBeNull();
  });

  it("drops body padding when flush", () => {
    const el = render({ flush: true });
    expect(el.querySelector(".gt-panel__body")!.classList).toContain(
      "gt-panel__body--flush",
    );
  });

  it("marks the danger tone on the host", () => {
    expect(render({}).classList).not.toContain("gt-panel--danger");
    expect(render({ tone: "danger" }).classList).toContain("gt-panel--danger");
  });

  it("shows the subtitle after the title with its full text as a tooltip", () => {
    const el = render({ title: "Breadcrumbs", subtitle: "28" });
    const subtitle = el.querySelector(".gt-panel__subtitle")!;
    expect(subtitle.textContent?.trim()).toBe("28");
    expect(subtitle.getAttribute("title")).toBe("28");
    expect(
      render({ title: "Breadcrumbs" }).querySelector(".gt-panel__subtitle"),
    ).toBeNull();
  });

  it("keeps the subtitle out of the heading and the region name", () => {
    const el = render({ title: "Breadcrumbs", subtitle: "28" });
    const heading = el.querySelector('[role="heading"]')!;
    expect(heading.textContent).toBe("Breadcrumbs");
    expect(heading.querySelector(".gt-panel__subtitle")).toBeNull();
    expect(el.getAttribute("aria-labelledby")).toBe(heading.id);
  });

  it("marks hideSubtitleNarrow on the host", () => {
    expect(render({ hideSubtitleNarrow: true }).classList).toContain(
      "gt-panel--hide-subtitle-narrow",
    );
  });
});
