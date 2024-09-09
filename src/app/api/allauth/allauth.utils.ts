import {
  ALLAUTH_SERVER_ERROR,
  ALLAUTH_UNHANDLED_ERROR,
} from "src/app/constants";
import {
  AllAuth400ErrorResponse,
  AllAuthError,
  AllAuthHttpErrorResponse,
} from "./allauth.interfaces";

/**
 * Process an allauth headless api error response,
 * fetching standardized error information out of it
 */
export function handleAllAuthErrorResponse(
  err: AllAuthHttpErrorResponse,
): AllAuthError[] {
  if (err.status === 400) {
    return (err.error as AllAuth400ErrorResponse).errors;
  } else if (err.status === 500) {
    return ALLAUTH_SERVER_ERROR;
  }
  return ALLAUTH_UNHANDLED_ERROR;
}
