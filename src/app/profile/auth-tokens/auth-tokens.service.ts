import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, EMPTY } from "rxjs";
import { tap, map, catchError } from "rxjs/operators";
import { APIToken } from "src/app/api/api-tokens/api-tokens.interfaces";
import { APITokenService } from "src/app/api/api-tokens/api-tokens.service";

interface AuthTokensState {
  apiTokens: APIToken[];
  loading: {
    apiTokens: boolean;
    create: boolean;
    delete: string | null;
  };
  createError: string;
  createErrorLabel: string;
  createErrorScopes: string;
}

const initialState: AuthTokensState = {
  apiTokens: [],
  loading: {
    apiTokens: false,
    create: false,
    delete: null,
  },
  createError: "",
  createErrorLabel: "",
  createErrorScopes: "",
};

@Injectable({
  providedIn: "root",
})
export class AuthTokensService {
  private readonly state = new BehaviorSubject<AuthTokensState>(initialState);
  private readonly getState$ = this.state.asObservable();
  readonly apiTokens$ = this.getState$.pipe(map((state) => state.apiTokens));
  readonly initialLoad$ = this.getState$.pipe(
    map((state) => state.loading.apiTokens)
  );
  readonly createError$ = this.getState$.pipe(
    map((state) => state.createError)
  );
  readonly createErrorLabel$ = this.getState$.pipe(
    map((state) => state.createErrorLabel)
  );
  readonly createErrorScopes$ = this.getState$.pipe(
    map((state) => state.createErrorScopes)
  );
  readonly createLoading$ = this.getState$.pipe(
    map((state) => state.loading.create)
  );
  readonly deleteLoading$ = this.getState$.pipe(
    map((state) => state.loading.delete)
  );

  constructor(
    private apiTokenService: APITokenService,
    private router: Router
  ) {}

  loadAuthTokens() {
    this.apiTokenService
      .list()
      .pipe(
        tap((apiTokens) => {
          this.setAPITokensLoading();
          this.setAPITokens(apiTokens);
        })
      )
      .toPromise();
  }

  createAuthToken(label: string, scopes: string[]) {
    this.setCreateLoading(true);
    this.apiTokenService
      .create({ label, scopes })
      // TODO handle errors
      .pipe(
        tap(() => {
          this.setCreateLoading(false);
          this.router.navigate(["/profile/auth-tokens"]);
        }),
        catchError((error) => {
          this.setCreateLoading(false);
          if (error) {
            if (error.status === 400) {
              if (error.error.label) {
                error.error.label.length === 1
                  ? this.setCreateLabelError(error.error.label[0])
                  : this.setCreateLabelError(error.error.label.join(" "));
              }
              if (error.error.scopes) {
                error.error.scopes.length === 1
                  ? this.setCreateScopesError(error.error.scopes[0])
                  : this.setCreateScopesError(error.error.scopes.join(" "));
              }
            } else {
              this.setCreateError(`${error.statusText}: ${error.status}`);
            }
          }
          return EMPTY;
        })
      )
      .toPromise();
  }

  deleteAuthToken(id: string) {
    this.setDeleteLoading(id);
    this.apiTokenService
      .destroy(id)
      .pipe(
        tap(() => {
          this.loadAuthTokens();
        })
      )
      .toPromise();
  }

  clear() {
    this.state.next(initialState);
  }

  resetCreateErrors() {
    const state = this.state.getValue();
    this.state.next({
      ...state,
      createError: "",
      createErrorLabel: "",
      createErrorScopes: "",
    });
  }

  private setAPITokens(apiTokens: APIToken[]) {
    const state = this.state.getValue();
    this.state.next({
      ...state,
      apiTokens,
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

  private setCreateLoading(isLoading: boolean) {
    const state = this.state.getValue();
    this.state.next({
      ...state,
      loading: { ...state.loading, create: isLoading },
    });
  }

  private setCreateError(error: string) {
    const state = this.state.getValue();
    this.state.next({
      ...state,
      createError: error,
    });
  }

  private setCreateLabelError(error: string) {
    const state = this.state.getValue();
    this.state.next({
      ...state,
      createErrorLabel: error,
    });
  }

  private setCreateScopesError(error: string) {
    const state = this.state.getValue();
    this.state.next({
      ...state,
      createErrorScopes: error,
    });
  }
}
