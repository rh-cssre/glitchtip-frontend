import type {} from "@angular/localize/init";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { TestBed } from "@angular/core/testing";
import { AlertConditions } from "../alert-labels";
import { AlertSummaryComponent } from "./alert-summary.component";

describe("AlertSummaryComponent", () => {
  let lang: string;

  beforeEach(() => {
    lang = document.documentElement.lang;
    document.documentElement.lang = "en";
  });

  afterEach(() => {
    document.documentElement.lang = lang;
  });

  function render(alert: AlertConditions, recipients: number | null = null) {
    const fixture = TestBed.createComponent(AlertSummaryComponent);
    fixture.componentRef.setInput("alert", alert);
    fixture.componentRef.setInput("recipients", recipients);
    fixture.detectChanges();
    return (fixture.nativeElement as HTMLElement).textContent
      ?.replace(/\s+/g, " ")
      .trim();
  }

  describe("saved alert", () => {
    it("describes an event trigger", () => {
      expect(render({ quantity: 1, timespanMinutes: 1 })).toBe(
        "Alerts when an issue gets 1 event in 1 minute.",
      );
      expect(render({ quantity: 5, timespanMinutes: 10 })).toBe(
        "Alerts when an issue gets 5 events in 10 minutes.",
      );
    });

    it("describes an uptime trigger", () => {
      expect(render({ uptime: true })).toBe(
        "Alerts when an uptime monitor goes down.",
      );
    });

    it("describes both triggers in one sentence", () => {
      expect(render({ quantity: 2, timespanMinutes: 5, uptime: true })).toBe(
        "Alerts when an issue gets 2 events in 5 minutes or an uptime monitor goes down.",
      );
    });

    it("says when nothing triggers the alert", () => {
      expect(render({ quantity: 0, timespanMinutes: 1 })).toBe(
        "Never alerts: no trigger is set.",
      );
    });

    it("lists environments as alternatives", () => {
      expect(
        render({ uptime: true, environments: ["production", "staging"] }),
      ).toBe(
        "Alerts when an uptime monitor goes down. Only in production or staging.",
      );
    });
  });

  describe("draft", () => {
    it("asks for a trigger first", () => {
      expect(render({}, 2)).toBe("Pick at least one trigger above.");
    });

    it("counts recipients", () => {
      const conditions = { uptime: true };
      expect(render(conditions, 0)).toBe(
        "Alerts when an uptime monitor goes down. Nobody is notified until you add a recipient.",
      );
      expect(render(conditions, 1)).toBe(
        "Alerts when an uptime monitor goes down. Notifies 1 recipient.",
      );
      expect(render(conditions, 3)).toBe(
        "Alerts when an uptime monitor goes down. Notifies 3 recipients.",
      );
    });
  });
});
