import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { APIBaseService } from "../api-base.service";
import { map } from "rxjs/operators";
import { decode, encode } from "cborg";

type UserKeyType = "FIDO2" | "TOTP" | "Trusted Device" | "Backup Codes";

export interface UserKey {
  id: number;
  user: number;
  name: string;
  created: string;
  key_type: UserKeyType;
  last_used: string;
}

export interface TOTPResponse {
  provisioning_uri: string;
  secret_key: string;
}

export type BackupCodes = string[];

interface BackUpGenerateResponse {
  codes: BackupCodes;
}

interface BackUpCodesRequest {
  name: string;
  codes: BackupCodes;
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
  readonly backupCodesUrl = this.url + "backup_codes/";

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
    return this.http.get(this.fido2Url, {
      headers: {
        Accept: "application/octet-stream"
      },
      responseType: "arraybuffer"
    })
    .pipe(map(response => {
      const converted = new Uint8Array(response);
      return decode(converted);
    }));
  }

  fido2Create(attResponse: AuthenticatorAttestationResponse, name: string) {
    const request = encode({
      attestationObject: new Uint8Array(attResponse.attestationObject),
      clientDataJSON: new Uint8Array(attResponse.clientDataJSON),
      name
    });
    return this.http.post<UserKey>(this.fido2Url, request.buffer, {
      headers: {
        "Content-Type": "application/cbor",
      }
    });
  }

  totp() {
    return this.http.get<TOTPResponse>(this.totpUrl);
  }

  totpCreate(data: TOTPRequest) {
    return this.http.post<unknown>(this.totpUrl, data);
  }

  backupCodes() {
    return this.http.get<BackUpGenerateResponse>(this.backupCodesUrl);
  }

  backupCodesCreate(data: BackUpCodesRequest) {
    return this.http.post<UserKey>(this.backupCodesUrl, data);
  }
}
