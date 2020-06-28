export function urlParamsToObject(url: string | null) {
  return url ? paramsToObject(new URLSearchParams(url.split("?")[1])) : null;
}

export function paramsToObject(entries: URLSearchParams) {
  const result: { [key: string]: string } = {};
  entries.forEach((value, key) => {
    result[key] = value;
  });
  return result;
}

export function normalizeProjectParams(project: string | object) {
  let projects: string[] | {} = [];
  if (typeof project === "string") {
    projects = [project];
  } else if (typeof project === "object") {
    projects = project;
  }
  return projects;
}
