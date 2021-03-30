import { user } from "../fixtures/users";

export function seedBackend(doExtraStuff: boolean) {
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
