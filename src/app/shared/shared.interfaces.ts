export interface ProjectCardButton {
  link: string | unknown[];
  icon?: string;
  text: string;
}

export interface ProjectCardButtonWithQuery extends ProjectCardButton {
  query?: { [k: string]: unknown };
}

/** Any API can be loading and may return an error */
export interface APIState {
  loading: boolean;
}
