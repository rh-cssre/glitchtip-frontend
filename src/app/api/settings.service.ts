import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject } from "rxjs";
import { tap, map } from "rxjs/operators";

interface SettingsState {
  socialAuth: boolean;
}

const initialState: SettingsState = {
  socialAuth: false
};

@Injectable({
  providedIn: "root"
})
export class SettingsService {
  private readonly state = new BehaviorSubject<SettingsState>(initialState);
  socialAuth$ = this.state.pipe(map(settings => settings.socialAuth));
  private readonly url = "/api/settings/";

  constructor(private http: HttpClient) {}

  /** Get and set conf settings from backend. Typically run on application start */
  getSettings() {
    return this.retrieveSettings().pipe(
      tap(settings => this.setSettings(settings))
    );
  }

  private retrieveSettings() {
    return this.http.get<SettingsState>(this.url);
  }

  private setSettings(settings: SettingsState) {
    this.state.next(settings);
  }
}
