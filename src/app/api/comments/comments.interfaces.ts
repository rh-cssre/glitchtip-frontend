import { User } from "../user/user.interfaces";

export interface Comment {
  data: {
    text: string;
  };
  user: User | null;
  dateCreated: string;
  type: string;
}
