export interface UserReport {
  eventId: string;
  name: string;
  event: {
    eventId: string;
  };
  user: unknown;
  dateCreated: string;
  id: number;
  comments: string;
  email: string;
}
