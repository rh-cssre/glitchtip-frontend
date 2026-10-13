declare global {
  interface Window {
    // Chatwoot live-chat SDK, loaded on demand by SupportChatService.
    // Only the methods this app calls are typed.
    chatwootSDK?: {
      run(config: { websiteToken: string; baseUrl: string }): void;
    };
    $chatwoot?: {
      toggle(state?: "open" | "close"): void;
      setConversationCustomAttributes(
        attributes: Record<string, unknown>,
      ): void;
    };
  }
}

export {};