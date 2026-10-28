import { describe, expect, it } from "vitest";
import { Component } from "@angular/core";
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

  it("reads title, actions, body, then footer in order", () => {
    @Component({
      imports: [PanelComponent],
      template: `
        <gt-panel title="Webhooks">
          <button slot="actions">Add webhook</button>
          <p>No webhooks yet</p>
          <span slot="footer-hint">Sent on every alert</span>
          <button slot="footer">Save</button>
        </gt-panel>
      `,
    })
    class HostComponent {}

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const order = [
      el.querySelector('[role="heading"]')!,
      el.querySelector("[slot=actions]")!,
      el.querySelector("p")!,
      el.querySelector("[slot=footer-hint]")!,
      el.querySelector("[slot=footer]")!,
    ];
    for (let i = 1; i < order.length; i++) {
      expect(
        order[i - 1].compareDocumentPosition(order[i]) &
          Node.DOCUMENT_POSITION_FOLLOWING,
      ).toBeTruthy();
    }
  });

  it("shows a lead fact instead of a heading when titleless", () => {
    @Component({
      imports: [PanelComponent],
      template: `<gt-panel><span slot="lead">3 environments</span></gt-panel>`,
    })
    class HostComponent {}

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('[role="heading"]')).toBeNull();
    expect(el.textContent).toContain("3 environments");
  });
});
