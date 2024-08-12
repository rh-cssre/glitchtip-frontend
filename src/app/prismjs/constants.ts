export const PRISM_SUPPORTED_GRAMMAR = [
  "javascript",
  "csharp",
  "python",
  "java",
  "ruby",
  "php",
  "go",
  "rust",
];

export const GRAMMAR_MAPPINGS: { [key: string]: string } = {
  node: "javascript",
};

export const PRISM_ALL_SUPPORTED_GRAMMAR = PRISM_SUPPORTED_GRAMMAR.concat(
  Object.keys(GRAMMAR_MAPPINGS)
);
