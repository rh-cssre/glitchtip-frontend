import { computed, effect, Injectable, inject } from "@angular/core";
import { MicroSentryService } from "@micro-sentry/angular";
import { apiResource } from "../shared/api/api-resource-factory";

export const DSN_REGEXP =
  /^(?:(\w+):)\/\/(?:(\w+)(?::(\w+))?@)([\w.-]+)(?::(\d+))?\/(.+)/;

@Injectable({
  providedIn: "root",
})
export class SettingsService {
  private microSentry = inject(MicroSentryService);

  settingsResource = apiResource(() => ({ url: "/api/settings/" }));
  settings = computed(() => this.settingsResource.value());
  socialApps = computed(() => this.settings()?.socialApps || []);
  billingEnabled = computed(() => this.settings()?.billingEnabled);
  paidForGlitchTip = computed(() => this.settings()?.iPaidForGlitchTip);
  stripePublicKey = computed(() => this.settings()?.stripePublicKey);
  sentryDSN = computed(() => this.settings()?.sentryDSN);
  environment = computed(() => this.settings()?.environment);
  chatwootWebsiteToken = computed(() => this.settings()?.chatwootWebsiteToken);
  enableUserRegistration = computed(
    () => this.settings()?.enableUserRegistration,
  );
  enableOrganizationCreation = computed(
    () => this.settings()?.enableOrganizationCreation,
  );
  serverTimeZone = computed(() => this.settings()?.serverTimeZone);
  initialLoad = computed(() => this.settingsResource.hasValue());
  version = computed(() => this.settings()?.version);
  instanceName = computed(() => this.settings()?.glitchtipInstanceName);

  constructor() {
    setTimeout(() => this.refreshSettings(), 5000);
    effect(() => {
      // Configure microsentry and chatwoot. Use computed functions to avoid
      // running when unnecessary
      const sentryDSN = this.sentryDSN();
      const environment = this.environment();
      const version = this.version();
      const chatwootWebsiteToken = this.chatwootWebsiteToken();
      if (sentryDSN) {
        // Micro-sentry does not support dynamic configuration, force it to
        const options = {
          dsn: sentryDSN,
          environment: environment ? environment : undefined,
          release: version ? "glitchtip@" + version : undefined,
        };
        // https://github.com/Tinkoff/micro-sentry/blob/main/libs/core/src/lib/service/micro-sentry-client.ts#L14
        const searched = DSN_REGEXP.exec(options.dsn);
        const dsn = searched ? searched.slice(1) : [];
        const pathWithProjectId = dsn[5].split("/");
        const path = pathWithProjectId.slice(0, -1).join("/");
        (this.microSentry.apiUrl as string) =
          dsn[0] +
          "://" +
          dsn[3] +
          (dsn[4] ? ":" + dsn[4] : "") +
          (path ? "/" + path : "") +
          "/api/" +
          pathWithProjectId.pop() +
          "/store/";
        (this.microSentry.authHeader as string) =
          "Sentry sentry_version=7,sentry_key=" +
          dsn[1] +
          (dsn[2] ? ",sentry_secret=" + dsn[2] : "");
        if (options.environment) {
          (this.microSentry.environment as string) = options.environment;
        }
        if (options.release) {
          (this.microSentry as any).release = options.release;
        }
      }
      if (chatwootWebsiteToken) {
        (function (d, t) {
          const BASE_URL = "https://app.chatwoot.com";
          const g: any = d.createElement(t),
            s: any = d.getElementsByTagName(t)[0];
          g.src = BASE_URL + "/packs/js/sdk.js";
          s.parentNode.insertBefore(g, s);
          g.onload = function () {
            (window as any).chatwootSDK.run({
              websiteToken: chatwootWebsiteToken,
              baseUrl: BASE_URL,
            });
          };
        })(document, "script");
      }
    });
  }

  triggerPlausibleReport(orgSlug: string | undefined) {
    if (window.plausible) {
      var url = window.location.href;
      url = url.replace(/\/\d+(\/|$)/g, "/<id>/");

      window.plausible("pageview", {
        u: orgSlug ? url.replace(`/${orgSlug}/`, "/<organization_slug>/") : url,
      });
    }
  }

  reload() {
    this.settingsResource.reload();
  }

  private refreshSettings() {
    this.reload();
    setTimeout(() => this.refreshSettings(), 30 * 60 * 1000); // 30 min
  }
}
