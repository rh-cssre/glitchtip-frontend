import { user } from "../fixtures/users";

export function seedBackend() {
  const url = "/api/test/seed/";
  cy.request("POST", url);
}

export function requestLogin() {
  const url = "/rest-auth/login/";
  return cy
    .request("POST", url, {
      email: user.email,
      password: user.password,
    })
    .then((response) => {
      localStorage.setItem("auth", JSON.stringify(response?.body));
    });
}
