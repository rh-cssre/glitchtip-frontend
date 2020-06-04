export interface ProjectCardButton {
  link: string | any[];
  icon?: string;
  text: string;
}

export interface ProjectCardButtonWithQuery extends ProjectCardButton {
  query?: { [k: string]: any };
}
