import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import * as Sentry from "@sentry/angular";
import { BehaviorSubject } from "rxjs";
import { tap, map } from "rxjs/operators";
import { SocialApp } from "./user/user.interfaces";

interface SettingsState {
  socialApps: SocialApp[];
  billingEnabled: boolean;
  iPaidForGlitchTip: boolean | null;
  enableUserRegistration: boolean;
  matomoURL: string | null;
  matomoSiteId: string | null;
  chatwootWebsiteToken: string | null;
  stripePublicKey: string | null;
  sentryDSN: string | null;
  sentryTracesSampleRate: number | null;
  environment: string | null;
  version: string | null;
}

const initialState: SettingsState = {
  socialApps: [],
  billingEnabled: false,
  iPaidForGlitchTip: null,
  enableUserRegistration: false,
  matomoURL: null,
  matomoSiteId: null,
  chatwootWebsiteToken: null,
  stripePublicKey: null,
  sentryDSN: null,
  sentryTracesSampleRate: null,
  environment: null,
  version: null,
};

@Injectable({
  providedIn: "root",
})
export class SettingsService {
  private readonly state = new BehaviorSubject<SettingsState>(initialState);
  socialApps$ = this.state.pipe(map((settings) => settings.socialApps));
  billingEnabled$ = this.state.pipe(map((settings) => settings.billingEnabled));
  paidForGlitchTip$ = this.state.pipe(
    map((settings) => settings.iPaidForGlitchTip)
  );
  stripePublicKey$ = this.state.pipe(
    map((settings) => settings.stripePublicKey)
  );
  enableUserRegistration$ = this.state.pipe(
    map((settings) => settings.enableUserRegistration)
  );
  private readonly url = "/api/settings/";

  constructor(private http: HttpClient) {}

  /** Get and set conf settings from backend. Typically run on application start */
  getSettings() {
    return this.retrieveSettings().pipe(
      tap((settings) => this.setSettings(settings)),
      tap((settings) => {
        if (settings.matomoSiteId && settings.matomoURL) {
          // tslint:disable:no-any
          const _PAQ = ((window as any)._paq = (window as any)._paq || []);
          /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
          _PAQ.push(["trackPageView"]);
          _PAQ.push(["enableLinkTracking"]);
          const u = settings.matomoURL;
          _PAQ.push(["setTrackerUrl", u + "matomo.php"]);
          _PAQ.push(["setSiteId", settings.matomoSiteId]);
          _PAQ.push(["setDomains", ["glitchtip.com", "app.glitchtip.com"]]);
          _PAQ.push(["enableCrossDomainLinking"]);
          const d = document;
          const g = d.createElement("script");
          const s = d.getElementsByTagName("script")[0];
          g.type = "text/javascript";
          g.async = true;
          g.defer = true;
          g.src = u + "matomo.js";
          s.parentNode!.insertBefore(g, s);
        }
      }),
      tap((settings) => {
        if (settings.sentryDSN) {
          Sentry.init({
            dsn: settings.sentryDSN,
            environment: settings.environment
              ? settings.environment
              : undefined,
            release: settings.version
              ? "glitchtip@" + settings.version
              : undefined,
            autoSessionTracking: false,
            tracesSampleRate: settings.sentryTracesSampleRate
              ? settings.sentryTracesSampleRate
              : undefined,
          });
        }
      }),
      tap((settings) => {
        if (settings.chatwootWebsiteToken) {
          // tslint:disable:only-arrow-functions
          // tslint:disable:space-before-function-paren
          // tslint:disable:one-variable-per-declaration
          (function (d, t) {
            const BASE_URL = "https://app.chatwoot.com";
            const g: any = d.createElement(t),
              s: any = d.getElementsByTagName(t)[0];
            g.src = BASE_URL + "/packs/js/sdk.js";
            s.parentNode.insertBefore(g, s);
            g.onload = function () {
              (window as any).chatwootSDK.run({
                websiteToken: settings.chatwootWebsiteToken,
                baseUrl: BASE_URL,
              });
            };
          })(document, "script");
        }
      })
    );
  }

  private retrieveSettings() {
    return this.http.get<SettingsState>(this.url);
  }

  private setSettings(settings: SettingsState) {
    this.state.next(settings);
  }
}
