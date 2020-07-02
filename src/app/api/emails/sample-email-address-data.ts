import { EmailAddress } from "./email.interfaces";

export const sampleEmailAddressData: EmailAddress[] = [
  {
    isPrimary: false,
    email: "aa@example.com",
    isVerified: true,
  },
  {
    isPrimary: false,
    email: "ac@example.com",
    isVerified: true,
  },
  {
    isPrimary: false,
    email: "test@example.com",
    isVerified: false,
  },
  {
    isPrimary: true,
    email: "primaryEmailAddress@example.com",
    isVerified: true,
  },
  {
    isPrimary: false,
    email: "hello@example.com",
    isVerified: false,
  },
];
