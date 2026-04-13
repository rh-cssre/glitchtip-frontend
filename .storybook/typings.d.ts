declare module "*.md" {
  const content: string;
  export default content;
}

interface Window {
  plausible?: any;
  Cypress?: unknown;
}
