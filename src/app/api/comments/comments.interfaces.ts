import { User } from "../user/user.interfaces";

export interface Comment {
  id: number;
  data: {
    text: string;
  };
  user: User | null;
  dateCreated: string;
  type: string;
}
