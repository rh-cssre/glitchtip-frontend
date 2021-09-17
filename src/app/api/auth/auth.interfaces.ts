export type ValidAuth = "TOTP" | "FIDO2";

export interface LoginResponse {
  requires_mfa: boolean;
  valid_auth: ValidAuth[];
}
