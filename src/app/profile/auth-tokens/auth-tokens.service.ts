import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { tap, map } from "rxjs/operators";
import { APIToken } from "src/app/api/api-tokens/api-tokens.interfaces";
import { APITokenService } from "src/app/api/api-tokens/api-tokens.service";

interface AuthTokensState {
  apiTokens: APIToken[];
  loading: {
    apiTokens: boolean;
    create: boolean;
    delete: string | null;
  };
}

const initialState: AuthTokensState = {
  apiTokens: [],
  loading: {
    apiTokens: false,
    create: false,
    delete: null,
  },
};

@Injectable({
  providedIn: "root",
})
export class AuthTokensService {
  private readonly state = new BehaviorSubject<AuthTokensState>(initialState);
  private readonly getState$ = this.state.asObservable();
  readonly apiTokens$ = this.getState$.pipe(map((state) => state.apiTokens));

  constructor(private apiTokenService: APITokenService) {}

  loadAuthTokens() {
    this.setAPITokensLoading();
    this.apiTokenService
      .list()
      .pipe(tap((apiTokens) => this.setAPITokens(apiTokens)))
      .toPromise();
  }

  createAuthToken(label: string, scopes: string[]) {
    this.setCreateLoading();
    this.apiTokenService
      .create({ label, scopes })
      // TODO handle errors
      .pipe(tap(() => this.loadAuthTokens()))
      .toPromise();
  }

  deleteAuthToken(id: string) {
    this.setDeleteLoading(id);
    this.apiTokenService
      .destroy(id)
      .pipe(tap(() => this.loadAuthTokens()))
      .toPromise();
  }

  clear() {
    this.state.next(initialState);
  }

  private setAPITokens(apiTokens: APIToken[]) {
    const state = this.state.getValue();
    this.state.next({
      ...state,
      apiTokens,
      loading: { ...initialState.loading },
    });
  }

  private setAPITokensLoading() {
    const state = this.state.getValue();
    this.state.next({
      ...state,
      loading: { ...state.loading, apiTokens: true },
    });
  }

  private setDeleteLoading(id: string) {
    const state = this.state.getValue();
    this.state.next({
      ...state,
      loading: { ...state.loading, delete: id },
    });
  }

  private setCreateLoading() {
    const state = this.state.getValue();
    this.state.next({
      ...state,
      loading: { ...state.loading, create: true },
    });
  }
}
