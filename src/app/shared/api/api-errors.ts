import { SERVER_ERROR, UNHANDLED_ERROR } from "../../constants";

/** Represents structured django-ninja error raised from Pydantic validation */
interface UnprocessableEntityDetail {
  type: string;
  loc: (string | number)[];
  msg: string;
  ctx?: { [key: string]: any };
}

/** Represents more generic error raised from django-ninja ValidationError List[DictStrAny] */
type GenericErrorDetailItem = Record<string, any>;

export interface NinjaErrorResponse {
  detail: UnprocessableEntityDetail[] | GenericErrorDetailItem[];
}

export function isNinjaErrorResponse(
  payload: any,
): payload is NinjaErrorResponse {
  if (typeof payload !== "object" || payload === null || !payload.detail) {
    return false;
  }
  // Length matters: every caller reads detail[0].msg, so an empty array has to
  // fall through to a generic message rather than be treated as a valid body.
  if (!Array.isArray(payload.detail) || payload.detail.length === 0) {
    return false;
  }
  return true;
}

/**
 * Carries a `NinjaErrorResponse` as a real `Error`.
 *
 * Angular's `resource` rejects a non-Error rejection: `.value()` then throws
 * `ResourceValueError` on every read, which escapes change detection and
 * freezes the view mid-render. Throwing this keeps the error state readable.
 */
export class ApiError extends Error {
  constructor(readonly response: NinjaErrorResponse) {
    super(response.detail[0]?.msg ?? UNHANDLED_ERROR);
    this.name = "ApiError";
  }
}

/** Type guard for the payload carried by a thrown `ApiError`. */
export function getNinjaErrorResponse(
  err: unknown,
): NinjaErrorResponse | undefined {
  if (err instanceof ApiError) {
    return err.response;
  }
  // Tolerate a bare payload: callers threw one directly before ApiError existed.
  return isNinjaErrorResponse(err) ? err : undefined;
}

export function handleError(
  error: any,
  response: Response,
): NinjaErrorResponse {
  switch (response.status) {
    case 400:
      if (error && typeof error === "object" && "detail" in error) {
        return { detail: [{ msg: error.detail }] };
      }
      break;
    case 402:
    case 502:
      // The server writes owner-facing text for these (a card decline, a failed
      // Stripe call); passing it through beats a generic message.
      if (error && typeof error === "object" && "detail" in error) {
        return { detail: [{ msg: error.detail }] };
      }
      break;
    case 404:
      return { detail: [{ msg: response.statusText }] };
    case 422:
      if (isNinjaErrorResponse(error)) {
        return error;
      }
      break;
    case 500:
      return { detail: [{ msg: SERVER_ERROR }] };
  }
  return { detail: [{ msg: UNHANDLED_ERROR }] };
}
