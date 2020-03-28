export function seedBackend() {
  let backendBaseURL = Cypress.env("backendBaseURL");
  if (!backendBaseURL) {
    backendBaseURL = "";
  }
  const url = backendBaseURL + "/api/test/seed/";
  cy.request("POST", url);
}
