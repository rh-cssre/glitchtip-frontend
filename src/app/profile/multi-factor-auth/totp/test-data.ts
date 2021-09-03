import { UserKey } from "src/app/api/mfa/user-keys.service";

export const totpUserKey: UserKey = {
  id: 1,
  created: "",
  key_type: "TOTP",
  last_used: "",
  name: "TOTP Key",
  user: 1,
};
