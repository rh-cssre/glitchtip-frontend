import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { map } from "rxjs/operators";

interface MainNavState {
  navOpen: boolean;
}

const initialState: MainNavState = {
  navOpen: true
};

@Injectable({
  providedIn: "root"
})
export class MainNavService {
  private readonly state = new BehaviorSubject<MainNavState>(initialState);
  private readonly getState$ = this.state.asObservable();

  readonly navOpen$ = this.getState$.pipe(map(state => state.navOpen));

  constructor() {}

  getToggledNav() {
    this.toggleNav();
  }

  getOpenedNav() {
    this.openOrCloseNav(true);
  }

  getClosedNav() {
    this.openOrCloseNav(false);
  }

  private toggleNav() {
    const navOpen = this.state.getValue().navOpen;
    this.state.next({ ...this.state.getValue(), navOpen: !navOpen });
  }

  private openOrCloseNav(navBoolean: boolean) {
    this.state.next({ ...this.state.getValue(), navOpen: navBoolean });
  }
}
