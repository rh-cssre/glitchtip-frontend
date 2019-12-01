interface ProjectKey {
  label: string;
  public_key: string;
  date_added: string;
  dsn: string;
}

export interface ProjectNew {
  name: string;
  platform: string;
}

export interface Project extends ProjectNew {
  slug: string;
  date_added: string;
  projectkey_set: ProjectKey[];
}
