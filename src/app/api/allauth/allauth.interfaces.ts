import { HttpErrorResponse } from "@angular/common/http";
import { components } from "../allauth-schema";

type Flow = components["schemas"]["Flow"];

interface AllAuthUser {
  id: number;
  display: string;
  has_usable_password: boolean;
  email: string;
}

interface AuthenticationMethod {
  method: "password" | "socialaccount";
  at: number;
  email?: string;
  provider?: string;
  uid?: string;
}

export interface AllAuthResponse {
  status: number;
}

interface Provider {
  id: string;
  name: string;
  client_id?: string;
  flows: string[];
}

interface ProviderAccount {
  uid: string;
  display: string;
  provider: Provider;
}

interface AuthenticationMeta {
  is_authenticated: boolean;
}

interface Authenticated {
  user: AllAuthUser;
  methods: AuthenticationMethod[];
}

export interface AllAuthSessionResponse extends AllAuthResponse {
  data: Authenticated | { flows: Flow[] };
  meta: AuthenticationMeta;
}

export interface AllAuthLoginResponse extends AllAuthResponse {
  user?: AllAuthUser;
  methods?: any;
  meta: AuthenticationMeta;
}

export interface AllAuthProvidersResponse extends AllAuthLoginResponse {
  data: ProviderAccount[];
}

export interface AuthFlow extends Flow {
  types?: string[];
}

export interface AllAuthLoginNotAuthResponse extends AllAuthResponse {
  status: 401;
  data: {
    flows: AuthFlow[];
  };
  meta: AuthenticationMeta;
}

export interface AllAuthGetEmailVerificationResponse extends AllAuthResponse {
  data: any;
  meta: any;
}

export interface AllAuthError {
  code: string;
  param?: string;
  message: string;
}

export interface AllAuth400ErrorResponse {
  status: 400;
  errors: AllAuthError[];
}

export interface AllAuth400HttpErrorResponse extends HttpErrorResponse {
  error: AllAuth400ErrorResponse;
}

export type AllAuthHttpErrorResponse =
  | AllAuth400HttpErrorResponse
  | HttpErrorResponse;

interface AuthenticatorBase {
  last_used_at: number;
  created_at: number;
  type: string;
}

export interface TOTPAuthenticator extends AuthenticatorBase {
  type: "totp";
}

interface RecoveryCodesAuthenticator extends AuthenticatorBase {
  type: "recovery_codes";
  total_code_count: number;
  unused_code_count: number;
}

export interface WebAuthnAuthenticator extends AuthenticatorBase {
  type: "webauthn";
  id: number;
  name: string;
  is_passwordless?: boolean;
}

export type Authenticator =
  | TOTPAuthenticator
  | RecoveryCodesAuthenticator
  | WebAuthnAuthenticator;

export interface AuthenticatorTOTPStatusNotFound extends AllAuthResponse {
  status: 404;
  meta: {
    secret: string;
    totp_url: string;
  };
}
