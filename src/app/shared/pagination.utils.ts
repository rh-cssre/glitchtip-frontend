export interface PaginationState {
  hits: number;
  maxHits: number;
  nextPageURL: string;
  previousPageURL: string;
}

function paramsToObject(entries: URLSearchParams) {
  const result: { [key: string]: string[] } = {};
  entries.forEach((value, key) => {
    result[key] ? result[key].push(value) : (result[key] = [value]);
  });
  return result;
}

export function urlParamsToObject(url: string | null) {
  return url ? paramsToObject(new URLSearchParams(url.split("?")[1])) : null;
}

/**
 * Pagination info exists in a header, this parses it out for storing.
 */
export const processLinkHeader = (linkHeader: string) =>
  linkHeader.split(",").reduce<{ [key: string]: string }>((acc, link) => {
    // Only return results url when results are present
    const match = link.match(/<(.*)>; rel="(\w*)"/);
    const results = link
      .split("; ")
      .find((x) => x.startsWith("results"))
      ?.includes("true");
    if (results && match) {
      const url = match[1];
      const rel = match[2];
      acc[rel] = url;
      return acc;
    }
    return acc;
  }, {});

/** Parse pagination headers from API response */
export function getPaginationHeaders(response: {
  headers: Headers;
}): PaginationState {
  const link = response.headers.get("link");
  const hits = response.headers.get("x-hits");
  const maxHits = response.headers.get("x-max-hits");

  if (link === null || hits === null || maxHits === null) {
    throw new Error(
      `Critical Error: Missing required pagination headers from API response`,
    );
  }

  const links = processLinkHeader(link);
  return {
    hits: parseInt(hits),
    maxHits: parseInt(maxHits),
    nextPageURL: links.next,
    previousPageURL: links.previous,
  };
}

/** Compute paginator object which contains convenience fields such as human readable count */
export function getPaginator(pagination: PaginationState | undefined) {
  if (pagination === undefined) {
    return undefined;
  }
  return {
    ...pagination,
    hasNextPage: !!pagination.nextPageURL,
    hasPreviousPage: !!pagination.previousPageURL,
    nextPageParams: urlParamsToObject(pagination.nextPageURL),
    previousPageParams: urlParamsToObject(pagination.previousPageURL),
    count:
      pagination.hits && pagination.hits === pagination.maxHits
        ? pagination.hits.toString() + "+"
        : pagination.hits?.toString(),
  };
}
