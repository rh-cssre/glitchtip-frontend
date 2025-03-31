import { TOTPAuthenticator } from "src/app/api/allauth/allauth.interfaces";

export const totpUserKey: TOTPAuthenticator = {
  type: "totp",
  created_at: 1,
  last_used_at: 1,
};
