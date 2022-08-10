export const PRISM_SUPPORTED_GRAMMER = [
  "javascript",
  "csharp",
  "python",
  "java",
  "ruby",
  "php",
  "go",
  "rust",
];

export const GRAMMER_MAPPINGS: { [key: string]: string } = {
  node: "javascript",
};

export const PRISM_ALL_SUPPORTED_GRAMMER = PRISM_SUPPORTED_GRAMMER.concat(
  Object.keys(GRAMMER_MAPPINGS)
);
