import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject } from "rxjs";
import { tap, map } from "rxjs/operators";
import { MatomoInjector } from "ngx-matomo";
import * as Sentry from "@sentry/browser";

interface SettingsState {
  socialAuth: boolean;
  billingEnabled: boolean;
  matomoURL: string | null;
  matomoSiteId: string | null;
  sentryDSN: string | null;
}

const initialState: SettingsState = {
  socialAuth: false,
  billingEnabled: false,
  matomoURL: null,
  matomoSiteId: null,
  sentryDSN: null,
};

@Injectable({
  providedIn: "root",
})
export class SettingsService {
  private readonly state = new BehaviorSubject<SettingsState>(initialState);
  socialAuth$ = this.state.pipe(map((settings) => settings.socialAuth));
  billingEnabled$ = this.state.pipe(map((settings) => settings.billingEnabled));
  private readonly url = "/api/settings/";

  constructor(
    private http: HttpClient,
    private matomoInjector: MatomoInjector
  ) {}

  /** Get and set conf settings from backend. Typically run on application start */
  getSettings() {
    return this.retrieveSettings().pipe(
      tap((settings) => this.setSettings(settings)),
      tap((settings) => {
        if (settings.matomoSiteId && settings.matomoURL) {
          this.matomoInjector.init(settings.matomoURL, +settings.matomoSiteId);
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
