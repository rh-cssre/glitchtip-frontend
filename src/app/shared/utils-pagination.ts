/**
 * Pagination info exists in a header, this parses it out for storing.
 * Anything with an actual link indicates it has results. This differs just
 * very slightly from sentry open source.
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
