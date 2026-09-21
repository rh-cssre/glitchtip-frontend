import { describe, it, expect } from "vitest";
import {
  PaginationState,
  processLinkHeader,
  getPaginationHeaders,
  getCursor,
  updateArrayById,
  getPaginator,
} from "./pagination.utils";

/**
 * These tests cover the pagination layer that sits between every list view and
 * the API. The backend returns paging state in HTTP headers (RFC 5988 `Link`,
 * plus `X-Hits`/`X-Max-Hits`), and a subtle bug here silently breaks "next
 * page", duplicates rows, or mislabels counts across the whole app. The logic
 * is pure, so it is cheap and deterministic to pin down.
 */

/** Build a minimal `{ headers: Headers }` response, like fetch/HttpClient give us. */
const responseWith = (headers: Record<string, string>) => ({
  headers: new Headers(headers),
});

describe("processLinkHeader", () => {
  it("only returns URLs whose `results=true`, keyed by rel", () => {
    const link =
      '<https://api/issues?cursor=PREV>; rel="previous"; results="false", ' +
      '<https://api/issues?cursor=NEXT>; rel="next"; results="true"';

    expect(processLinkHeader(link)).toEqual({
      next: "https://api/issues?cursor=NEXT",
    });
  });

  it("returns an empty object when no link advertises results", () => {
    const link =
      '<https://api/issues?cursor=PREV>; rel="previous"; results="false"';

    expect(processLinkHeader(link)).toEqual({});
  });
});

describe("getPaginationHeaders", () => {
  it("parses hits/maxHits and resolves next/previous URLs", () => {
    const response = responseWith({
      "x-hits": "42",
      "x-max-hits": "1000",
      link:
        '<https://api/issues?cursor=PREV>; rel="previous"; results="true", ' +
        '<https://api/issues?cursor=NEXT>; rel="next"; results="true"',
    });

    expect(getPaginationHeaders(response)).toEqual({
      hits: 42,
      maxHits: 1000,
      nextPageURL: "https://api/issues?cursor=NEXT",
      previousPageURL: "https://api/issues?cursor=PREV",
    });
  });

  it("throws a Critical Error when a required header is missing", () => {
    const response = responseWith({ "x-hits": "42", "x-max-hits": "1000" });

    expect(() => getPaginationHeaders(response)).toThrowError(
      /Missing required pagination headers/,
    );
  });
});

describe("getCursor", () => {
  it("extracts the `cursor` query param from the next page URL", () => {
    const response = responseWith({
      "x-hits": "10",
      "x-max-hits": "10",
      link: '<https://api/issues?cursor=abc123>; rel="next"; results="true"',
    });

    expect(getCursor(response)).toBe("abc123");
  });

  it("returns null when there is no next page", () => {
    const response = responseWith({
      "x-hits": "10",
      "x-max-hits": "10",
      link: '<https://api/issues?cursor=abc>; rel="previous"; results="true"',
    });

    expect(getCursor(response)).toBeNull();
  });
});

describe("updateArrayById", () => {
  it("updates matching items in place and appends new ones", () => {
    const target = [
      { id: 1, name: "a" },
      { id: 2, name: "b" },
    ];
    const source = [
      { id: 2, name: "b-updated" },
      { id: 3, name: "c" },
    ];

    const result = updateArrayById(target, source);

    expect(result).toEqual([
      { id: 1, name: "a" },
      { id: 2, name: "b-updated" },
      { id: 3, name: "c" },
    ]);
    // Mutates and returns the same reference (callers rely on this).
    expect(result).toBe(target);
  });
});

describe("getPaginator", () => {
  const base: PaginationState = {
    hits: 5,
    maxHits: 1000,
    nextPageURL: "https://api/issues?cursor=NEXT&query=is%3Aunresolved",
    previousPageURL: "",
  };

  it("derives hasNextPage/hasPreviousPage from the URLs", () => {
    const paginator = getPaginator(base)!;

    expect(paginator.hasNextPage).toBe(true);
    expect(paginator.hasPreviousPage).toBe(false);
    expect(paginator.nextPageParams).toEqual({
      cursor: ["NEXT"],
      query: ["is:unresolved"],
    });
  });

  it('appends "+" to the count when hits has reached maxHits', () => {
    expect(getPaginator({ ...base, hits: 1000, maxHits: 1000 })!.count).toBe(
      "1000+",
    );
  });

  it("shows a plain count when below maxHits", () => {
    expect(getPaginator(base)!.count).toBe("5");
  });

  it("returns undefined for undefined pagination", () => {
    expect(getPaginator(undefined)).toBeUndefined();
  });
});
