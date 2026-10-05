import createClient, {
  type ClientOptions,
  type Middleware,
} from "openapi-fetch";
import type { paths } from "../../api/api-schema";
import type { paths as allauthPaths } from "../../api/allauth-schema";
import { getCSRFToken } from "../shared.utils";

export {
  isNinjaErrorResponse,
  handleError,
  type NinjaErrorResponse,
} from "./api-errors";

const csrfMiddleware: Middleware = {
  async onRequest({ request }) {
    if (["DELETE", "POST", "PUT", "PATCH"].includes(request.method)) {
      request.headers.set("X-CSRFToken", getCSRFToken()!);
    }
    return request;
  },
};

const authErrorResponseMiddleware: Middleware = {
  async onResponse({ response, schemaPath }) {
    if (schemaPath === "/_allauth/browser/v1/auth/session") {
      return;
    }
    if (response.status === 401 || response.status === 403) {
      const body = await response
        .clone()
        .json()
        .catch(() => ({}));
      if (
        body?.detail === "Unauthorized" ||
        body?.detail === "Authentication credentials were not provided."
      ) {
        localStorage.setItem("isAuthenticated", "false");
        window.location.href = "/";
        return new Promise(() => {});
      }
    }
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
client.use(authErrorResponseMiddleware);
