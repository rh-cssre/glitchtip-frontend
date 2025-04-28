export interface RelatedTeam {
  id: number;
  slug: string;
}

export interface Team extends RelatedTeam {
  dateCreated: string;
  isMember: boolean;
  memberCount: number;
}

export interface TeamErrors {
  updateName: string;
  deleteTeam: string;
}

export interface TeamLoading {
  updateName: boolean;
  deleteTeam: boolean;
}
