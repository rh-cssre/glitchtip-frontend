import createClient, {
  type ClientOptions,
  type Middleware,
} from "openapi-fetch";
import type { paths } from "./api-schema";
import type { paths as allauthPaths } from "./allauth-schema";
import { getCSRFToken } from "../shared/shared.utils";

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
export const client = createClient<paths & allauthPaths>(options);
client.use(csrfMiddleware);
