export interface OrganizationNew {
  name: string;
  slug: string;
  //   agreeTerms: boolean;
}

export interface Organization extends OrganizationNew {
  dateCreated: string;
}
