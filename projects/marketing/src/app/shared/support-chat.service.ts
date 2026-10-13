import { Injectable, PLATFORM_ID, inject, signal } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";

const CHATWOOT_BASE_URL = "https://app.chatwoot.com";
const CHATWOOT_WEBSITE_TOKEN = "Nh1Q6ZEPmduVP4c4Zmj7W9b4";
// Chatwoot keeps the visitor's conversation in this cookie once they have chatted.
const CHATWOOT_COOKIE = "cw_conversation";
const LOAD_TIMEOUT_MS = 8000;

/**
 * Loads the Chatwoot support chat only when it is wanted: when the visitor
 * opens it, or on later visits by someone who already has a conversation.
 * Everyone else loads no third-party script and sends nothing to Chatwoot.
 */
@Injectable({
  providedIn: "root",
})
export class SupportChatService {
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private loadPromise: Promise<boolean> | null = null;

  readonly opening = signal(false);

  /** Restore the widget for visitors who already have a conversation. */
  resumeExistingConversation() {
    if (this.isBrowser && document.cookie.includes(CHATWOOT_COOKIE)) {
      this.load();
    }
  }

  /** Load the widget if needed and open it. Resolves false if it can't load. */
  async open(): Promise<boolean> {
    this.opening.set(true);
    const loaded = await this.load();
    this.opening.set(false);
    if (loaded) window.$chatwoot?.toggle("open");
    return loaded;
  }

  private load(): Promise<boolean> {
    if (!this.isBrowser) return Promise.resolve(false);
    this.loadPromise ??= new Promise<boolean>((resolve) => {
      const timeout = setTimeout(() => finish(false), LOAD_TIMEOUT_MS);
      const finish = (loaded: boolean) => {
        clearTimeout(timeout);
        window.removeEventListener("chatwoot:ready", onReady);
        // Allow a later retry, e.g. after an ad blocker is disabled.
        if (!loaded) this.loadPromise = null;
        resolve(loaded);
      };
      // The SDK only accepts commands once its iframe has loaded.
      const onReady = () => finish(true);
      window.addEventListener("chatwoot:ready", onReady);

      const script = document.createElement("script");
      script.src = `${CHATWOOT_BASE_URL}/packs/js/sdk.js`;
      script.async = true;
      script.onload = () =>
        window.chatwootSDK?.run({
          websiteToken: CHATWOOT_WEBSITE_TOKEN,
          baseUrl: CHATWOOT_BASE_URL,
        });
      script.onerror = () => finish(false);
      document.body.appendChild(script);
    });
    return this.loadPromise;
  }
}
