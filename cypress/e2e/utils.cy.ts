import { user } from "../fixtures/users";

export function seedBackend(doExtraStuff = false) {
  const url = `/api/test/seed/${doExtraStuff ? "?extras=true" : ""}`;
  cy.request("POST", url);
}

export function requestLogin() {
  const url = "/_allauth/browser/v1/auth/login";
  cy.setLocalStorage("isAuthenticated", "true");

  return cy
    .request({ method: "HEAD", url, failOnStatusCode: false })
    .then((response) => {
      const headers = response.headers["set-cookie"] as string[];
      const csrfTokenCookie = headers.find((cookie) =>
        cookie.startsWith("csrftoken"),
      )!;
      const csrfToken = csrfTokenCookie.split(";")[0].split("=")[1];
      return cy.request({
        method: "POST",
        url,
        body: {
          email: user.email,
          password: user.password,
        },
        headers: { "X-CSRFToken": csrfToken },
      });
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
