import { user } from "../fixtures/users";

export function seedBackend(doExtraStuff = false) {
  const url = `/api/test/seed/${doExtraStuff ? "?extras=true" : ""}`;
  cy.request("POST", url);
}

export function requestLogin() {
  const url = "/rest-auth/login/";
  cy.setLocalStorage("auth", JSON.stringify({ isLoggedIn: true }));
  return cy.request("POST", url, {
    email: user.email,
    password: user.password,
  });
}

export function uniqueId(length = 32) {
  return [...Array(length)]
    .map(() => Math.floor(Math.random() * 16).toString(16))
    .join("");
}

export const getDSN = (dsn: string, target = "store") => {
  const key = dsn.split("@")[0].split("//")[1];
  const id = dsn.split("@")[1].split("/")[1];
  const url = `/api/${id}/${target}/?sentry_key=${key}&sentry_version=7`;
  return url;
};
