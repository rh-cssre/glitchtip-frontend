import { describe, it, expect, vi } from "vitest";

// api-errors.ts reaches constants.ts, whose strings go through Angular's $localize.
// That global only exists in a built app, so stand it in before the imports
// hoist rather than adding a setup file the other specs do not need.
vi.hoisted(() => {
  (globalThis as Record<string, unknown>)["$localize"] = (
    parts: TemplateStringsArray,
  ) => parts.join("");
});

import { handleError, isNinjaErrorResponse } from "./api-errors";
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
