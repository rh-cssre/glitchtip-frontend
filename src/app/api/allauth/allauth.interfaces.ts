import { HttpErrorResponse } from "@angular/common/http";
import {
  CredentialCreationOptionsJSON,
  CredentialRequestOptionsJSON,
} from "@github/webauthn-json";

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

interface Flow {
  id: string;
  providers?: string[];
  is_pending?: true;
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

type FlowID =
  | "verify_email"
  | "login"
  | "signup"
  | "provider_redirect"
  | "provider_signup"
  | "provider_token"
  | "mfa_authenticate"
  | "reauthenticate"
  | "mfa_reauthenticate";

export interface AuthFlow {
  id: FlowID;
  providers?: Provider[];
  is_pending?: boolean;
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

interface RecoveryCodesAuthenticatorCodes extends RecoveryCodesAuthenticator {
  unused_codes: string[];
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

export interface AuthenticatorsResponse extends AllAuthResponse {
  data: Authenticator[];
}

export interface AuthenticatorTOTPStatusResponse extends AllAuthResponse {
  data: TOTPAuthenticator;
}

export interface AuthenticatorTOTPStatusNotFound extends AllAuthResponse {
  status: 404;
  meta: {
    secret: string;
    totp_url: string;
  };
}

export interface RegenerateRecoveryCodesResponse extends AllAuthResponse {
  data: RecoveryCodesAuthenticatorCodes;
}

export interface GetWebauthnResponse extends AllAuthResponse {
  data: {
    creation_options: CredentialCreationOptionsJSON;
  };
}

export interface WebAuthnAuthenticatorResponse extends AllAuthResponse {
  status: 200;
  data: WebAuthnAuthenticator;
  meta: {
    recovery_codes_generated: boolean;
  };
}

export interface GetWebAuthnCredentialRequestResponse extends AllAuthResponse {
  data: {
    request_options: CredentialRequestOptionsJSON;
  };
}
