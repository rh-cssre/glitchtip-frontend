interface Window {
  plausible?: any;
  Cypress?: unknown;
  // Chatwoot support chat SDK, loaded on demand by SupportChatService.
  chatwootSDK?: { run(config: { websiteToken: string; baseUrl: string }): void };
  $chatwoot?: {
    toggle(state?: "open" | "close"): void;
    setUser(
      identifier: string | number,
      user: { email: string; identifier_hash: string },
    ): void;
    setCustomAttributes(attributes: Record<string, unknown>): void;
  };
}
