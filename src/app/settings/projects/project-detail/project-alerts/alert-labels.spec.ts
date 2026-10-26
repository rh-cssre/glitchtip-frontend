import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { alertSummary, draftSummary, recipientLabel } from "./alert-labels";
import { toRecipientInput } from "./project-alerts.service";

describe("alert labels", () => {
  let lang: string;

  beforeEach(() => {
    lang = document.documentElement.lang;
    document.documentElement.lang = "en";
  });

  afterEach(() => {
    document.documentElement.lang = lang;
  });

  describe("alertSummary", () => {
    it("describes an event trigger", () => {
      expect(alertSummary({ quantity: 1, timespanMinutes: 1 })).toBe(
        "Alerts when an issue gets 1 event in 1 minute.",
      );
      expect(alertSummary({ quantity: 5, timespanMinutes: 10 })).toBe(
        "Alerts when an issue gets 5 events in 10 minutes.",
      );
    });

    it("describes an uptime trigger", () => {
      expect(alertSummary({ uptime: true })).toBe(
        "Alerts when an uptime monitor goes down.",
      );
    });

    it("describes both triggers in one sentence", () => {
      expect(
        alertSummary({ quantity: 2, timespanMinutes: 5, uptime: true }),
      ).toBe(
        "Alerts when an issue gets 2 events in 5 minutes or an uptime monitor goes down.",
      );
    });

    it("says when nothing triggers the alert", () => {
      expect(alertSummary({ quantity: 0, timespanMinutes: 1 })).toBe(
        "Never alerts: no trigger is set.",
      );
    });

    it("lists environments as alternatives", () => {
      expect(
        alertSummary({
          uptime: true,
          environments: ["production", "staging"],
        }),
      ).toBe(
        "Alerts when an uptime monitor goes down. Only in production or staging.",
      );
    });
  });

  describe("draftSummary", () => {
    it("asks for a trigger first", () => {
      expect(draftSummary({}, 2)).toBe("Pick at least one trigger above.");
    });

    it("counts recipients", () => {
      const conditions = { uptime: true };
      expect(draftSummary(conditions, 0)).toBe(
        "Alerts when an uptime monitor goes down. Nobody is notified until you add a recipient.",
      );
      expect(draftSummary(conditions, 1)).toBe(
        "Alerts when an uptime monitor goes down. Notifies 1 recipient.",
      );
      expect(draftSummary(conditions, 3)).toBe(
        "Alerts when an uptime monitor goes down. Notifies 3 recipients.",
      );
    });
  });

  describe("recipientLabel", () => {
    const email = { recipientType: "email", url: "" };

    it("names the project's teams for email", () => {
      expect(recipientLabel(email)).toBe(
        "Email the members of this project's teams.",
      );
      expect(recipientLabel(email, [])).toBe(
        "Email team members. This project has no teams, so nobody gets these emails.",
      );
      expect(recipientLabel(email, ["web", "ops"])).toBe(
        "Email the members of #web, #ops.",
      );
    });

    it("shows the Zulip channel, saved or new", () => {
      expect(
        recipientLabel({
          recipientType: "zulip",
          url: "https://chat.example.com",
          config: { channel: "alerts" },
        }),
      ).toBe("Zulip: alerts");
      expect(
        recipientLabel({
          recipientType: "zulip",
          url: "https://chat.example.com",
          channel: "ops",
        }),
      ).toBe("Zulip: ops");
    });

    it("shows the URL for webhooks", () => {
      expect(
        recipientLabel({ recipientType: "webhook", url: "https://x.test" }),
      ).toBe("https://x.test");
    });
  });
});

describe("toRecipientInput", () => {
  it("adds https:// to a URL without a scheme", () => {
    expect(
      toRecipientInput({ recipientType: "webhook", url: "ntfy.sh/topic" }).url,
    ).toBe("https://ntfy.sh/topic");
  });

  it("keeps a URL that has a scheme", () => {
    expect(
      toRecipientInput({ recipientType: "webhook", url: "http://hook.test" })
        .url,
    ).toBe("http://hook.test");
  });

  it("leaves an email recipient's empty URL alone", () => {
    expect(toRecipientInput({ recipientType: "email", url: "" }).url).toBe("");
  });

  it("flattens a saved Zulip recipient's config", () => {
    expect(
      toRecipientInput({
        id: 1,
        recipientType: "zulip",
        url: "chat.example.com",
        config: { bot_email: "bot@x.test", api_key: "k", channel: "ops" },
      }),
    ).toEqual({
      recipientType: "zulip",
      url: "https://chat.example.com",
      botEmail: "bot@x.test",
      apiKey: "k",
      channel: "ops",
      topic: "GlitchTip Alerts",
    });
  });
});
