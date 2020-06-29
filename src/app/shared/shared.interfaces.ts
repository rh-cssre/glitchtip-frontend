export interface ProjectCardButton {
  link: string | unknown[];
  icon?: string;
  text: string;
}

export interface ProjectCardButtonWithQuery extends ProjectCardButton {
  query?: { [k: string]: unknown };
}
