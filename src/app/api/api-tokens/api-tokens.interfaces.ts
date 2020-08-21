export interface NewAPIToken {
  scopes: string[];
  label: string;
}

export interface APIToken extends NewAPIToken {
  dateCreated: string;
  token: string;
  id: string;
}
