import { computed, effect, inject, Injectable, signal } from "@angular/core";
import { SettingsService } from "../api/settings.service";
import { UserService } from "../api/user/user.service";
import { OrganizationsService } from "../api/organizations.service";
import { SubscriptionService } from "../api/subscriptions/subscription.service";

const CHATWOOT_BASE_URL = "https://app.chatwoot.com";
// Chatwoot keeps the visitor's conversation in this cookie once they have chatted.
const CHATWOOT_COOKIE = "cw_conversation";
const LOAD_TIMEOUT_MS = 8000;

/**
 * Loads the Chatwoot support chat only when it is wanted: when the user opens
 * it, or on later visits by someone who already has a conversation. Visitors
 * who never chat load no third-party script and send nothing to Chatwoot.
 */
@Injectable({
  providedIn: "root",
})
export class SupportChatService {
  private settingsService = inject(SettingsService);
  private userService = inject(UserService);
  private organizationsService = inject(OrganizationsService);
  private subscriptionService = inject(SubscriptionService);

  private loadPromise: Promise<boolean> | null = null;
  private ready = signal(false);

  readonly available = computed(
    () => !!this.settingsService.chatwootWebsiteToken(),
  );
  readonly opening = signal(false);

  constructor() {
    effect(() => {
      if (this.available() && document.cookie.includes(CHATWOOT_COOKIE)) {
        this.load();
      }
    });
    // Keep the contact's identity current once the widget is loaded.
    effect(() => {
      if (this.ready()) this.identify();
    });
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
    const websiteToken = this.settingsService.chatwootWebsiteToken();
    if (!websiteToken) return Promise.resolve(false);
    this.loadPromise ??= new Promise<boolean>((resolve) => {
      const timeout = setTimeout(() => finish(false), LOAD_TIMEOUT_MS);
      const finish = (loaded: boolean) => {
        clearTimeout(timeout);
        window.removeEventListener("chatwoot:ready", onReady);
        if (loaded) {
          this.identify();
          this.ready.set(true);
        } else {
          // Allow a later retry, e.g. after an ad blocker is disabled.
          this.loadPromise = null;
        }
        resolve(loaded);
      };
      // The SDK only accepts commands once its iframe has loaded.
      const onReady = () => finish(true);
      window.addEventListener("chatwoot:ready", onReady);

      const script = document.createElement("script");
      script.src = `${CHATWOOT_BASE_URL}/packs/js/sdk.js`;
      script.async = true;
      script.onload = () =>
        window.chatwootSDK?.run({ websiteToken, baseUrl: CHATWOOT_BASE_URL });
      script.onerror = () => finish(false);
      document.body.appendChild(script);
    });
    return this.loadPromise;
  }

  private identify() {
    const user = this.userService.user();
    const orgSlug = this.organizationsService.activeOrganizationSlug();
    const subscription = this.subscriptionService.subscription();
    if (!user?.chatwootIdentifierHash || !window.$chatwoot) return;

    window.$chatwoot.setUser(user.id, {
      email: user.email,
      identifier_hash: user.chatwootIdentifierHash,
    });
    if (orgSlug) {
      window.$chatwoot.setCustomAttributes({
        organizationSlug: orgSlug,
        plan: subscription ? subscription.product.name : "free",
        planStatus: subscription?.status ?? "free",
      });
    }
  }
}
