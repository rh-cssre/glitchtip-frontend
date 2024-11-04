import { AllAuthError } from "./api/allauth/allauth.interfaces";

export const baseUrl = "/api/0";
export const allauthBase = "/_allauth/browser/v1";
export const SERVER_ERROR = $localize`500 Server Error`;
export const ALLAUTH_SERVER_ERROR: AllAuthError[] = [
  { code: "unhandled_error", message: SERVER_ERROR },
];
export const UNHANDLED_ERROR = $localize`Something went wrong`;
export const ALLAUTH_UNHANDLED_ERROR: AllAuthError[] = [
  { code: "unhandled_error", message: UNHANDLED_ERROR },
];
