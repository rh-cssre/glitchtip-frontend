import { describe, expect, it } from "vitest";
import { Component, Type } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { RecordBandComponent } from "./record-band.component";

@Component({
  imports: [RecordBandComponent],
  template: `
    <gt-record-band>
      <nav slot="tabs">Tabs</nav>
      <div slot="summary">Summary</div>
      <div slot="stats">Events</div>
      <h1>checkout-api</h1>
    </gt-record-band>
  `,
})
class FullBandComponent {}

@Component({
  imports: [RecordBandComponent],
  template: `<gt-record-band><h1>v1.2.0</h1></gt-record-band>`,
})
class IdentityOnlyBandComponent {}

@Component({
  imports: [RecordBandComponent],
  template: `<gt-record-band summary="strip"
    ><h1>TypeError</h1></gt-record-band
  >`,
})
class StripBandComponent {}

describe("RecordBandComponent", () => {
  function render(host: Type<unknown>) {
    const fixture = TestBed.createComponent(host);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it("reads identity, figures, summary, then tabs in order", () => {
    const el = render(FullBandComponent);
    const order = [
      el.querySelector("h1")!,
      el.querySelector("[slot=stats]")!,
      el.querySelector("[slot=summary]")!,
      el.querySelector("[slot=tabs]")!,
    ];
    for (let i = 1; i < order.length; i++) {
      expect(
        order[i - 1].compareDocumentPosition(order[i]) &
          Node.DOCUMENT_POSITION_FOLLOWING,
      ).toBeTruthy();
    }
  });

  it("hides the tiers that get no content", () => {
    const el = render(IdentityOnlyBandComponent);
    const heading = el.querySelector("h1")!;
    const boxes = Array.from(el.querySelectorAll("gt-record-band div"));
    const shown = boxes.filter(
      (box) => getComputedStyle(box).display !== "none",
    );
    expect(boxes.length).toBeGreaterThan(shown.length);
    expect(shown.every((box) => box.contains(heading))).toBe(true);
  });

  it("sets off a text summary on a strip only when asked", () => {
    const band = (host: Type<unknown>) =>
      render(host).querySelector("gt-record-band")!;
    expect(band(StripBandComponent).classList).toContain(
      "gt-record-band--strip",
    );
    expect(band(IdentityOnlyBandComponent).classList).not.toContain(
      "gt-record-band--strip",
    );
  });
});
