import createClient, {
  type ClientOptions,
  type Middleware,
} from "openapi-fetch";
import type { paths } from "../../api/api-schema";
import type { paths as allauthPaths } from "../../api/allauth-schema";
import { getCSRFToken } from "../shared.utils";
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
  if (!Array.isArray(payload.detail)) {
    return false;
  }
  return true;
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

const csrfMiddleware: Middleware = {
  async onRequest({ request }) {
    if (["DELETE", "POST", "PUT", "PATCH"].includes(request.method)) {
      request.headers.set("X-CSRFToken", getCSRFToken()!);
    }
    return request;
  },
};

const options: ClientOptions = {};
const baseElement = document.querySelector("base");
if (baseElement) {
  const baseHref = baseElement.href;
  if (baseHref !== "/") {
    options["baseUrl"] = baseHref;
  }
}
export type apiPaths = paths & allauthPaths;
export const client = createClient<apiPaths>(options);
client.use(csrfMiddleware);
