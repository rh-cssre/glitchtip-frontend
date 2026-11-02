// Type-only: declares the $localize global for the spec program. The runtime
// polyfill is already loaded by the test builder, and the app build picks the
// type up via main.ts, which the spec tsconfig does not include.
import type {} from "@angular/localize/init";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { signal } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { SettingsService } from "src/app/api/settings.service";
import {
  TERMS_BANNER_DISMISSED_KEY,
  TermsUpdateBannerComponent,
} from "./terms-update-banner.component";

describe("TermsUpdateBannerComponent", () => {
  const billingEnabled = signal<boolean | undefined>(true);

  function render(now: string) {
    vi.setSystemTime(new Date(now));
    const fixture = TestBed.createComponent(TermsUpdateBannerComponent);
    fixture.detectChanges();
    return fixture;
  }

  function text(fixture: ReturnType<typeof render>) {
    return (fixture.nativeElement as HTMLElement).textContent?.trim() ?? "";
  }

  beforeEach(async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    localStorage.removeItem(TERMS_BANNER_DISMISSED_KEY);
    billingEnabled.set(true);
    await TestBed.configureTestingModule({
      imports: [TermsUpdateBannerComponent],
      providers: [{ provide: SettingsService, useValue: { billingEnabled } }],
    }).compileComponents();
  });

  afterEach(() => {
    vi.useRealTimers();
    localStorage.removeItem(TERMS_BANNER_DISMISSED_KEY);
  });

  it("shows on hosted before the effective date", () => {
    expect(text(render("2026-10-21T12:00:00Z"))).toContain(
      "take effect for your account on November 21, 2026",
    );
  });

  it("stays hidden on self-hosted", () => {
    billingEnabled.set(false);
    expect(text(render("2026-10-21T12:00:00Z"))).toBe("");
  });

  it("stays hidden while settings are loading", () => {
    billingEnabled.set(undefined);
    expect(text(render("2026-10-21T12:00:00Z"))).toBe("");
  });

  it("stays hidden from the effective date on", () => {
    expect(text(render("2026-11-21T00:00:00Z"))).toBe("");
  });

  it("hides on dismiss and stays dismissed", () => {
    const fixture = render("2026-10-21T12:00:00Z");
    (fixture.nativeElement as HTMLElement).querySelector("button")!.click();
    fixture.detectChanges();
    expect(text(fixture)).toBe("");
    expect(text(render("2026-10-22T12:00:00Z"))).toBe("");
  });
});
