/**
 * Pagination info exists in a header, this parses it out for storing.
 * Anything with an actual link indicates it has results. This differs just
 * very slightly from sentry open source.
 */
export const processLinkHeader = (linkHeader: string) =>
  linkHeader.split(",").reduce<{ [key: string]: string }>((acc, link) => {
    const match = link.match(/<(.*)>; rel="(\w*)"/);
    if (match) {
      const url = match[1];
      const rel = match[2];
      acc[rel] = url;
      return acc;
    }
    return {};
  }, {});
