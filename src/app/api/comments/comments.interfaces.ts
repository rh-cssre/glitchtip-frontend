export interface Comment {
  id: number;
  data: {
    text: string;
  };
  user: CommentUser;
  dateCreated: string;
  type: string;
}

export interface CommentUser {
  id: string;
  email: string;
}
