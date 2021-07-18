import { Injectable } from "@angular/core";
import { map, tap } from "rxjs/operators";
import { UserKey, UserKeysService } from "src/app/api/mfa/user-keys.service";
import { StatefulService } from "src/app/shared/stateful-service/stateful-service";

interface MFAState {
  userKeys: UserKey[];
}

const initialState: MFAState = {
  userKeys: [],
};

@Injectable({
  providedIn: "root",
})
export class MultiFactorAuthService extends StatefulService<MFAState> {
  userKeys$ = this.getState$.pipe(map((state) => state.userKeys));
  constructor(private api: UserKeysService) {
    super(initialState);
  }

  getUserKeys() {
    return this.api.list().pipe(tap((userKeys) => this.setState({ userKeys })));
  }
}
