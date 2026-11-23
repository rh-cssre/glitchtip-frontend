import {
  ALLAUTH_SERVER_ERROR,
  ALLAUTH_UNHANDLED_ERROR,
} from "src/app/constants";
import { AllAuthError } from "./allauth.interfaces";

import { components } from "../allauth-schema";

type PermissiveAllAuthErrorResponse = Omit<
  components["schemas"]["ErrorResponse"],
  "status"
> & {
  status?: number;
};

/**
 * Process an allauth headless api error response,
 * fetching standardized error information out of it.
 * Takes both 'error' and 'response' due to AllAuth API docs
 * not including 500 as a possible error.
 */
export function handleAllAuthErrorResponse(
  err: PermissiveAllAuthErrorResponse | undefined,
  response: { status: number },
): AllAuthError[] {
  if (err?.status === 400) {
    return (<any>err.errors) as AllAuthError[];
  } else if (response.status === 500) {
    return ALLAUTH_SERVER_ERROR;
  }
  return ALLAUTH_UNHANDLED_ERROR;
}
