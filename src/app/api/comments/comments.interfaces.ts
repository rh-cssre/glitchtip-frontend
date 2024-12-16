export interface Comment {
  id: number;
  data: {
    text: string;
  };
  user: CommentUser | null;
  dateCreated: string;
  type: string;
}

export interface CommentUser {
  id: string;
  email: string;
}
