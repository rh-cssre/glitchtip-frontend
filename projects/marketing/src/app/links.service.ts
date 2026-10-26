import { Injectable } from "@angular/core";

const saasDomain = "https://app.glitchtip.com";
const saasRegister = saasDomain + "/register";
const saasLogin = saasDomain + "/login";

/** Return GlitchTip SAAS registration link with query param carryover */
export const getRegisterLink = () => {
  if (typeof window !== "undefined") {
    return saasRegister + window.location.search;
  }
  return saasRegister;
};

/** Fetch common links, support carrying over query params for utm */
@Injectable({
  providedIn: "root",
})
export class LinksService {
  registerLink = saasRegister;
  loginLink = saasLogin;
  constructor() {
    this.registerLink = getRegisterLink();
  }
}
