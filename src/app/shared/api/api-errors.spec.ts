// Type-only: declares the $localize global for the spec program. The runtime
// polyfill is already loaded by the test builder; replacing it here would leak
// into every spec that shares this worker.
import type {} from "@angular/localize/init";
import { describe, it, expect } from "vitest";

import {
  ApiError,
  apiErrorMessage,
  getNinjaErrorResponse,
  handleError,
  isNinjaErrorResponse,
} from "./api-errors";
import { SERVER_ERROR, UNHANDLED_ERROR } from "../../constants";

/**
 * Every caller reads `detail[0].msg` off the result, so handleError has to
 * guarantee a non-empty detail array for any response at all.
 */
const res = (status: number, statusText = "") =>
  new Response(null, { status, statusText });

describe("isNinjaErrorResponse", () => {
  it("accepts a populated detail array", () => {
    expect(isNinjaErrorResponse({ detail: [{ msg: "nope" }] })).toBe(true);
  });

  it("rejects a non-object", () => {
    expect(isNinjaErrorResponse(null)).toBe(false);
    expect(isNinjaErrorResponse("nope")).toBe(false);
  });

  it("rejects a detail that is not an array", () => {
    expect(isNinjaErrorResponse({ detail: "nope" })).toBe(false);
  });

  // Callers index into detail, so an empty array is not a usable body.
  it("rejects an empty detail array", () => {
    expect(isNinjaErrorResponse({ detail: [] })).toBe(false);
  });
});

describe("handleError", () => {
  it("passes through a 400 detail string", () => {
    expect(
      handleError({ detail: "Cap exceeds the maximum" }, res(400)).detail[0]
        .msg,
    ).toBe("Cap exceeds the maximum");
  });

  // The server writes owner-facing text for a declined card and a failed
  // Stripe call; both used to be replaced with the generic message.
  it("passes through a 402 card decline", () => {
    expect(
      handleError({ detail: "Your card was declined." }, res(402)).detail[0]
        .msg,
    ).toBe("Your card was declined.");
  });

  it("passes through a 403 permission denial", () => {
    const detail =
      "Permission denied. This endpoint requires one of ['org:admin']; your role in this organization (Manager) holds none of them.";
    expect(handleError({ detail }, res(403)).detail[0].msg).toBe(detail);
  });

  it("passes through a 502 upstream failure", () => {
    expect(
      handleError({ detail: "Could not enable overage billing." }, res(502))
        .detail[0].msg,
    ).toBe("Could not enable overage billing.");
  });

  it("uses the status text for a 404", () => {
    expect(handleError(null, res(404, "Not Found")).detail[0].msg).toBe(
      "Not Found",
    );
  });

  it("uses the server message for a 500", () => {
    expect(handleError(null, res(500)).detail[0].msg).toBe(SERVER_ERROR);
  });

  it("passes a 422 validation body through", () => {
    const body = { detail: [{ msg: "field required" }] };
    expect(handleError(body, res(422)).detail[0].msg).toBe("field required");
  });

  // The case that used to throw at the call site.
  it("falls back to a generic message for a 422 with an empty detail", () => {
    expect(handleError({ detail: [] }, res(422)).detail[0].msg).toBe(
      UNHANDLED_ERROR,
    );
  });

  it("falls back to a generic message for an unhandled status", () => {
    expect(handleError(null, res(418)).detail[0].msg).toBe(UNHANDLED_ERROR);
  });
});

/**
 * Angular's `resource` only keeps a readable error state when the rejection is
 * a real Error. A plain object made `.value()` throw on every read, freezing
 * list views behind a spinner until the page was reloaded.
 */
describe("ApiError", () => {
  it("is a real Error, so a resource can hold it as an error state", () => {
    const err = new ApiError(handleError(null, res(500)));

    expect(err).toBeInstanceOf(Error);
    expect(err.message).toBe(SERVER_ERROR);
  });

  it("carries the ninja payload for serverError to read back", () => {
    const payload = handleError({ detail: [{ msg: "nope" }] }, res(422));

    expect(new ApiError(payload).response).toBe(payload);
  });
});

describe("getNinjaErrorResponse", () => {
  it("unwraps the payload from a thrown ApiError", () => {
    const payload = handleError(null, res(500));

    expect(getNinjaErrorResponse(new ApiError(payload))).toBe(payload);
  });

  it("still accepts a bare payload thrown by older call sites", () => {
    const payload = { detail: [{ msg: "nope" }] };

    expect(getNinjaErrorResponse(payload)).toBe(payload);
  });

  it("returns undefined for anything else", () => {
    expect(getNinjaErrorResponse(new Error("boom"))).toBeUndefined();
    expect(getNinjaErrorResponse(undefined)).toBeUndefined();
  });
});

describe("apiErrorMessage", () => {
  const fallback = "Could not add the project.";

  it("shows the server's detail", () => {
    expect(
      apiErrorMessage({ detail: "Project not found" }, res(403), fallback),
    ).toBe("Project not found");
  });

  it("falls back when the body has no detail", () => {
    expect(apiErrorMessage({}, res(400), fallback)).toBe(fallback);
    expect(apiErrorMessage(undefined, res(400), fallback)).toBe(fallback);
  });

  it("falls back instead of a generic message", () => {
    expect(apiErrorMessage({ detail: "nope" }, res(418), fallback)).toBe(
      fallback,
    );
  });
});
