export function normalizeID(id: string | number): number {
  if (typeof id === "string") {
    return parseInt(id);
  }
  return id;
}
