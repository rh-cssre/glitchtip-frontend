import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { APIBaseService } from "../api-base.service";

export interface UserKey {
  id: number;
  user: number;
  name: string;
  created: string;
  key_type: string;
  last_used: string;
}

interface TOTPReponse {
  provisioning_uri: string;
  secret_key: string;
}

interface TOTPRequest {
  answer: string;
  secret_key: string;
}

/**
 * MFA User Keys
 * Create requires a specific mfa type and sometimes requires a GET to fetch
 * relevant data before submitting a POST to actually create the key
 */
@Injectable({
  providedIn: "root",
})
export class UserKeysService extends APIBaseService {
  readonly url = "/api/mfa/user_keys/";
  readonly fido2Url = this.url + "fido2/";
  readonly totpUrl = this.url + "totp/";

  constructor(protected http: HttpClient) {
    super(http);
  }
  list() {
    return this.http.get<UserKey[]>(this.url);
  }

  retrieve(id: string) {
    return this.http.get<UserKey>(this.detailURL(id));
  }

  destroy(id: string) {
    return this.http.delete(this.detailURL(id));
  }

  fido2() {
    // Should use cbor
    return this.http.get<unknown>(this.fido2Url);
  }

  fido2Create(data: unknown) {
    return this.http.post<unknown>(this.fido2Url, data);
  }

  totp() {
    return this.http.get<TOTPReponse>(this.totpUrl);
  }

  totpCreate(data: TOTPRequest) {
    return this.http.post<unknown>(this.totpUrl, data);
  }
}
