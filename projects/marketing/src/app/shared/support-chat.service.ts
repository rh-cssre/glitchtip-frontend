import { Injectable, PLATFORM_ID, inject, signal } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import {
  hasOpenedSupportChat,
  loadChatwoot,
  openChatwoot,
} from "src/app/shared/chatwoot/chatwoot-loader";

const CHATWOOT_WEBSITE_TOKEN = "Nh1Q6ZEPmduVP4c4Zmj7W9b4";

/**
 * The Chatwoot support chat, loaded only when the visitor opens it (or on
 * later visits once they have). See src/app/shared/chatwoot/chatwoot-loader.ts.
 */
@Injectable({
  providedIn: "root",
})
export class SupportChatService {
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly opening = signal(false);

  /** Restore the widget for visitors who have opened the chat before. */
  resumeExistingConversation() {
    if (this.isBrowser && hasOpenedSupportChat() && !navigator.webdriver) {
      loadChatwoot(CHATWOOT_WEBSITE_TOKEN);
    }
  }

  /** Load the widget if needed and open it. Resolves false if it can't load. */
  async open(): Promise<boolean> {
    if (!this.isBrowser) return false;
    this.opening.set(true);
    const opened = await openChatwoot(CHATWOOT_WEBSITE_TOKEN);
    this.opening.set(false);
    return opened;
  }
}
