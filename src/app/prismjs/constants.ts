export const PRISM_SUPPORTED_GRAMMAR = [
  "javascript",
  "json",
  "csharp",
  "python",
  "java",
  "ruby",
  "php",
  "go",
  "rust",
  "swift",
  "objectivec",
];

export const IOS_PLATFORMS = ["cocoa", "objc"] as const;

export const GRAMMAR_MAPPINGS: { [key: string]: string } = {
  node: "javascript",
  cocoa: "swift",
  objc: "objectivec",
};

export const PRISM_ALL_SUPPORTED_GRAMMAR = PRISM_SUPPORTED_GRAMMAR.concat(
  Object.keys(GRAMMAR_MAPPINGS),
);
