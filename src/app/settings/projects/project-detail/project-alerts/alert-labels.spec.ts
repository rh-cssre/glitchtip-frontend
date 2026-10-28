import { describe, expect, it } from "vitest";
import { recipientLabel } from "./alert-labels";
import { toRecipientInput } from "./project-alerts.service";

describe("alert labels", () => {
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

  it("sends an unsaved Zulip recipient's flat settings as they are", () => {
    const draft = {
      recipientType: "zulip",
      url: "https://chat.example.com",
      botEmail: "bot@x.test",
      apiKey: "k",
      channel: "ops",
      topic: "Deploys",
    };
    expect(toRecipientInput(draft)).toEqual(draft);
  });

  it("drops a saved recipient's id and config", () => {
    expect(
      toRecipientInput({
        id: 2,
        recipientType: "discord",
        url: "https://discord.test/hook",
        config: {},
      }),
    ).toEqual({ recipientType: "discord", url: "https://discord.test/hook" });
  });

  it("rejects a recipient type the API does not accept", () => {
    expect(() =>
      toRecipientInput({ recipientType: "pager", url: "" }),
    ).toThrow();
  });
});
