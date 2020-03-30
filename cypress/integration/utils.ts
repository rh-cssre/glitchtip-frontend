import { user } from "../fixtures/users";

function getBackendUrl() {
  let backendBaseURL = Cypress.env("backendBaseURL");
  if (!backendBaseURL) {
    backendBaseURL = "";
  }
  return backendBaseURL;
}

export function seedBackend() {
  const url = getBackendUrl() + "/api/test/seed/";
  cy.request("POST", url);
}

export function requestLogin() {
  const url = getBackendUrl() + "/rest-auth/login/";
  cy.request("POST", url, {
    email: user.email,
    password: user.password
  }).then(response => {
    localStorage.setItem("auth", JSON.stringify(response?.body));
  });
}
