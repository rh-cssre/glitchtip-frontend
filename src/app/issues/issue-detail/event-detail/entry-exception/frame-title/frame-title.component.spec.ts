import type {} from "@angular/localize/init";
import { describe, expect, it } from "vitest";
import { TestBed } from "@angular/core/testing";
import type { Frame } from "src/app/issues/interfaces";
import { FrameTitleComponent } from "./frame-title.component";

const baseFrame: Frame = {
  absPath: null,
  filename: null,
  platform: null,
  module: null,
  function: null,
  package: null,
  instructionAddr: null,
  symbol: null,
  symbolAddr: null,
  trust: null,
  inApp: true,
  context: null,
  vars: null,
  lineNo: null,
  colNo: null,
};

describe("FrameTitleComponent", () => {
  function render(frame: Partial<Frame>) {
    const fixture = TestBed.createComponent(FrameTitleComponent);
    fixture.componentInstance.frame = { ...baseFrame, ...frame };
    fixture.detectChanges();
    return (fixture.nativeElement as HTMLElement).textContent
      ?.replace(/\s+/g, " ")
      .trim();
  }

  it("keeps a space between the file URL and the function", () => {
    expect(
      render({
        filename: "app/pay.ts",
        absPath: "https://shop.example.com/app/pay.ts",
        function: "submitPayment",
        lineNo: 88,
      }),
    ).toBe(
      "app/pay.ts https://shop.example.com/app/pay.ts in submitPayment at line 88",
    );
  });

  it("keeps a space before the package", () => {
    expect(
      render({
        filename: "Foo.java",
        function: "run",
        lineNo: 10,
        package: "/usr/lib/libfoo.so",
      }),
    ).toBe("Foo.java in run at line 10 within /usr/lib/libfoo.so");
  });
});
