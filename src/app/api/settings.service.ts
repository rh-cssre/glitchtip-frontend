import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject } from "rxjs";
import { tap, map } from "rxjs/operators";
import * as Sentry from "@sentry/browser";

interface SettingsState {
  socialAuth: boolean;
  billingEnabled: boolean;
  enableUserRegistration: boolean;
  matomoURL: string | null;
  matomoSiteId: string | null;
  stripePublicKey: string | null;
  sentryDSN: string | null;
}

const initialState: SettingsState = {
  socialAuth: false,
  billingEnabled: false,
  enableUserRegistration: false,
  matomoURL: null,
  matomoSiteId: null,
  stripePublicKey: null,
  sentryDSN: null,
};

@Injectable({
  providedIn: "root",
})
export class SettingsService {
  private readonly state = new BehaviorSubject<SettingsState>(initialState);
  socialAuth$ = this.state.pipe(map((settings) => settings.socialAuth));
  billingEnabled$ = this.state.pipe(map((settings) => settings.billingEnabled));
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
          var _paq = (window as any)._paq || [];
          /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
          _paq.push(["trackPageView"]);
          _paq.push(["enableLinkTracking"]);
          var u = settings.matomoURL;
          _paq.push(["setTrackerUrl", u + "matomo.php"]);
          _paq.push(["setSiteId", settings.matomoSiteId]);
          var d = document,
            g = d.createElement("script"),
            s = d.getElementsByTagName("script")[0];
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
          });
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
