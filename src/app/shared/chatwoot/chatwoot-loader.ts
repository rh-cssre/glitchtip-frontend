/**
 * Framework-free loader for the Chatwoot support chat SDK, shared by the app
 * and the marketing site. The SDK is only loaded when someone opens the chat,
 * or on later visits by someone who has opened it before, so visitors who
 * never chat load no third-party script and send nothing to Chatwoot.
 */

declare global {
  interface Window {
    chatwootSDK?: {
      run(config: { websiteToken: string; baseUrl: string }): void;
    };
    // Only the SDK methods GlitchTip calls are typed.
    $chatwoot?: {
      hasLoaded?: boolean;
      toggle(state?: "open" | "close"): void;
      reset(): void;
      setUser(
        identifier: string | number,
        user: { email: string; identifier_hash: string },
      ): void;
      setCustomAttributes(attributes: Record<string, unknown>): void;
      setConversationCustomAttributes(attributes: Record<string, unknown>): void;
    };
  }
}

export const CHATWOOT_BASE_URL = "https://app.chatwoot.com";
const SDK_SRC = `${CHATWOOT_BASE_URL}/packs/js/sdk.js`;
export const CHATWOOT_LOAD_TIMEOUT_MS = 8000;
// Set by us when the visitor opens the chat. Chatwoot's own cookies can't be
// used for this: the SDK sets them as soon as it loads, not when someone chats.
const OPENED_KEY = "glitchtip-support-chat-opened";

let script: HTMLScriptElement | null = null;
let ready = false;
let pending: Promise<boolean> | null = null;
const readyCallbacks = new Set<() => void>();

function markReady() {
  ready = true;
  readyCallbacks.forEach((callback) => callback());
}

/** Run `callback` once the widget is ready, now or whenever that happens. */
export function onChatwootReady(callback: () => void): () => void {
  if (ready) callback();
  readyCallbacks.add(callback);
  return () => readyCallbacks.delete(callback);
}

/** Whether this browser has opened the support chat before. */
export function hasOpenedSupportChat(): boolean {
  try {
    return localStorage.getItem(OPENED_KEY) !== null;
  } catch {
    return false;
  }
}

function rememberOpened() {
  try {
    localStorage.setItem(OPENED_KEY, "1");
  } catch {
    // Storage unavailable: the chat just won't auto-resume next visit.
  }
}

/**
 * Load the SDK if needed. Resolves false if it errors or isn't ready within
 * the timeout. A late "ready" still counts: the script is never injected
 * twice, and the next call resolves true once the widget is up.
 */
export function loadChatwoot(websiteToken: string): Promise<boolean> {
  if (ready) return Promise.resolve(true);
  pending ??= new Promise<boolean>((resolve) => {
    const settle = (loaded: boolean) => {
      clearTimeout(timeout);
      readyCallbacks.delete(onReady);
      pending = null;
      resolve(loaded);
    };
    const onReady = () => settle(true);
    const timeout = setTimeout(() => settle(false), CHATWOOT_LOAD_TIMEOUT_MS);
    readyCallbacks.add(onReady);

    if (!script) {
      // The SDK dispatches this once its iframe has loaded; only then does it
      // accept commands.
      window.addEventListener("chatwoot:ready", markReady, { once: true });
      // However the chat gets opened, including from the bubble after a
      // load that outlasted the timeout, resume it on later visits.
      window.addEventListener("chatwoot:opened", rememberOpened);
      script = document.createElement("script");
      script.src = SDK_SRC;
      script.async = true;
      script.onload = () =>
        window.chatwootSDK?.run({ websiteToken, baseUrl: CHATWOOT_BASE_URL });
      script.onerror = () => {
        // Blocked or offline: drop the tag so a later attempt starts clean.
        window.removeEventListener("chatwoot:ready", markReady);
        script?.remove();
        script = null;
        settle(false);
      };
      document.body.appendChild(script);
    }
  });
  return pending;
}

function clearChatwootCookies() {
  for (const cookie of document.cookie.split(";")) {
    const name = cookie.split("=")[0].trim();
    if (name.startsWith("cw_")) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    }
  }
}

/** Load the SDK if needed and open the chat. Resolves false if it can't load. */
export async function openChatwoot(websiteToken: string): Promise<boolean> {
  if (!script && !ready && !hasOpenedSupportChat()) {
    // First chat in this browser: start a fresh session rather than reuse a
    // Chatwoot cookie we didn't ask for (left by older pages, or planted).
    clearChatwootCookies();
  }
  const loaded = await loadChatwoot(websiteToken);
  if (loaded) {
    rememberOpened();
    window.$chatwoot?.toggle("open");
  }
  return loaded;
}

/** Forget this browser's chat session, e.g. on logout on a shared machine. */
export function resetSupportChat() {
  try {
    localStorage.removeItem(OPENED_KEY);
  } catch {
    // Nothing to clear.
  }
  window.$chatwoot?.reset();
  // The SDK is usually not loaded at logout, so clear its cookies directly.
  clearChatwootCookies();
}
