import { describe, expect, it } from "vitest";
import { TestBed } from "@angular/core/testing";
import { GhostSelectComponent } from "./ghost-select.component";

const OPTIONS = [
  { value: "app", label: "App frames" },
  { value: "raw", label: "Raw" },
];

describe("GhostSelectComponent", () => {
  // mat-select fills its trigger once its options have rendered.
  async function render(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(GhostSelectComponent);
    fixture.componentRef.setInput("options", OPTIONS);
    fixture.componentRef.setInput("value", "app");
    fixture.componentRef.setInput("label", "Frames");
    for (const [key, value] of Object.entries(inputs)) {
      fixture.componentRef.setInput(key, value);
    }
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    return fixture;
  }

  it("shows the selected label and names the select", async () => {
    const el = (await render()).nativeElement as HTMLElement;
    expect(el.querySelector(".gt-select-ghost__value")?.textContent).toContain(
      "App frames",
    );
    expect(el.querySelector("mat-select")?.getAttribute("aria-label")).toBe(
      "Frames",
    );
  });

  it("follows the value model", async () => {
    const fixture = await render();
    fixture.componentRef.setInput("value", "raw");
    fixture.detectChanges();
    expect(fixture.componentInstance.current()).toBe("Raw");
  });

  it("renders the short label only when given", async () => {
    const short = async (inputs: Record<string, unknown>) =>
      ((await render(inputs)).nativeElement as HTMLElement).querySelector(
        ".gt-ghost-select__short",
      );
    expect(await short({})).toBeNull();
    expect((await short({ shortLabel: "App" }))?.textContent).toBe("App");
  });

  it("applies a fixed width", async () => {
    const el = (await render({ width: 140 })).nativeElement as HTMLElement;
    expect(
      (el.querySelector(".gt-select-ghost") as HTMLElement).style.width,
    ).toBe("140px");
  });
});
