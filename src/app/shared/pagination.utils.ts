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

export function getCursor(response: { headers: Headers }) {
  const nextPageURL = getPaginationHeaders(response).nextPageURL;
  if (nextPageURL) {
    return new URLSearchParams(new URL(nextPageURL).search).get("cursor");
  }
  return null;
}

/**
 * Updates a target array with items from a source array based on their 'id' property.
 * If an item with the same 'id' in the source array exists in the target array, it's updated.
 * Otherwise, the item from the source array is added to the target array.
 *
 * @template T An object type that must include an 'id' property (string or number).
 * @param {T[]} targetArray The array to be updated.
 * @param {T[]} sourceArray The array containing items to update or add.
 * @returns {T[]} The updated target array.
 */
export function updateArrayById<T extends { id: string | number }>(
  targetArray: T[],
  sourceArray: T[],
): T[] {
  sourceArray.forEach((sourceItem) => {
    const index = targetArray.findIndex(
      (targetItem) => targetItem.id === sourceItem.id,
    );
    if (index >= 0) {
      // Item found, update it
      targetArray[index] = sourceItem;
    } else {
      // Item not found, add it
      targetArray.push(sourceItem);
    }
  });
  return targetArray;
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
    /** Human readable object count string that appends "+" to indicate max hits */
    count:
      pagination.hits && pagination.hits === pagination.maxHits
        ? pagination.hits.toString() + "+"
        : pagination.hits?.toString(),
  };
}
