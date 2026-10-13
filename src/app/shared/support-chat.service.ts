import { computed, effect, inject, Injectable, signal } from "@angular/core";
import { SettingsService } from "../api/settings.service";
import { UserService } from "../api/user/user.service";
import { OrganizationsService } from "../api/organizations.service";
import { SubscriptionService } from "../api/subscriptions/subscription.service";
import {
  hasOpenedSupportChat,
  loadChatwoot,
  onChatwootReady,
  openChatwoot,
} from "./chatwoot/chatwoot-loader";

/**
 * The Chatwoot support chat, loaded only when the user opens it (or on later
 * visits once they have). See chatwoot-loader.ts.
 */
@Injectable({
  providedIn: "root",
})
export class SupportChatService {
  private settingsService = inject(SettingsService);
  private userService = inject(UserService);
  private organizationsService = inject(OrganizationsService);
  private subscriptionService = inject(SubscriptionService);

  private ready = signal(false);
  // The identity last sent, so unchanged values aren't re-sent to Chatwoot.
  private sentIdentity: string | null = null;
  private websiteToken = this.settingsService.chatwootWebsiteToken;

  readonly available = computed(() => !!this.websiteToken());
  readonly opening = signal(false);

  // What Chatwoot is told about the signed-in user and their current org.
  private identity = computed(() => {
    const user = this.userService.user();
    if (!user?.chatwootIdentifierHash) return null;
    const orgSlug = this.organizationsService.selectedOrganizationSlug();
    const subscription = this.subscriptionService.subscription();
    return {
      id: user.id,
      user: { email: user.email, identifier_hash: user.chatwootIdentifierHash },
      attributes: orgSlug
        ? {
            organizationSlug: orgSlug,
            plan: subscription ? subscription.product.name : "free",
            planStatus: subscription?.status ?? "free",
          }
        : null,
    };
  });

  constructor() {
    // Identify before the chat opens, then keep it current on org switches.
    onChatwootReady(() => {
      this.identify();
      this.ready.set(true);
    });
    effect(() => {
      const token = this.websiteToken();
      if (token && hasOpenedSupportChat() && !navigator.webdriver) {
        loadChatwoot(token);
      }
    });
    effect(() => {
      if (this.ready()) this.identify();
    });
  }

  /** Load the widget if needed and open it. Resolves false if it can't load. */
  async open(): Promise<boolean> {
    const token = this.websiteToken();
    if (!token) return false;
    this.opening.set(true);
    const opened = await openChatwoot(token);
    this.opening.set(false);
    return opened;
  }

  private identify() {
    const identity = this.identity();
    if (!window.$chatwoot) return;
    if (!identity) {
      // Signed out without a reload: drop the previous user's identity.
      if (this.sentIdentity) window.$chatwoot.reset();
      this.sentIdentity = null;
      return;
    }
    const key = JSON.stringify(identity);
    if (key === this.sentIdentity) return;
    window.$chatwoot.setUser(identity.id, identity.user);
    if (identity.attributes) {
      window.$chatwoot.setCustomAttributes(identity.attributes);
    }
    this.sentIdentity = key;
  }
}
