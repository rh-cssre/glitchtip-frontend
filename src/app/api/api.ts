import createClient, { type Middleware } from "openapi-fetch";
import type { paths } from "./api-schema";
import { getCSRFToken } from "../shared/shared.utils";

const csrfMiddleware: Middleware = {
  async onRequest({ request }) {
    request.headers.set("X-CSRFToken", getCSRFToken()!);
    return request;
  },
};

export const client = createClient<paths>();
client.use(csrfMiddleware);
