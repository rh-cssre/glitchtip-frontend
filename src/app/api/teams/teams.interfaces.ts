export interface Team {
  dateCreated: string;
  id: number;
  isMember: boolean;
  memberCount: number;
  slug: string;
}

export interface TeamErrors {
  updateName: string;
  deleteTeam: string;
}

export interface TeamLoading {
  updateName: boolean;
  deleteTeam: boolean;
}
