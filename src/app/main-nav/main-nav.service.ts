import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, fromEvent } from "rxjs";
import { debounceTime, map, tap } from "rxjs/operators";

interface MainNavState {
  navOpen: boolean;
  mobileNav: boolean | null;
}

const initialState: MainNavState = {
  navOpen: true,
  mobileNav: null,
};

@Injectable({
  providedIn: "root",
})
export class MainNavService {
  private readonly state = new BehaviorSubject<MainNavState>(initialState);
  private readonly getState$ = this.state.asObservable();

  readonly navOpen$ = this.getState$.pipe(map((state) => state.navOpen));
  readonly mobileNav$ = this.getState$.pipe(map((state) => state.mobileNav));

  constructor(private router: Router) {
    const tabletSize = 768; // same as $tablet for scss

    if (window.innerWidth < tabletSize) {
      this.mobileNavSettings();
    } else {
      this.desktopNavSettings();
    }

    this.router.events.subscribe((_) => {
      if (window.innerWidth < tabletSize) {
        this.setCloseNav();
      }
    });

    fromEvent(window, "resize")
      .pipe(
        debounceTime(100),
        tap((_) => {
          if (window.innerWidth < tabletSize) {
            this.mobileNavSettings();
          } else {
            this.desktopNavSettings();
          }
        })
      )
      .subscribe();
  }

  mobileNavSettings() {
    this.setMobileNav(true);
    this.setCloseNav();
  }

  desktopNavSettings() {
    this.setMobileNav(false);
    this.setOpenNav();
  }

  getToggleNav() {
    this.setToggleNav();
  }

  getClosedNav() {
    this.setCloseNav();
  }

  private setMobileNav(isMobile: boolean) {
    this.state.next({
      ...this.state.getValue(),
      mobileNav: isMobile,
    });
  }

  private setCloseNav() {
    this.state.next({
      ...this.state.getValue(),
      navOpen: false,
    });
  }

  private setOpenNav() {
    this.state.next({
      ...this.state.getValue(),
      navOpen: true,
    });
  }

  private setToggleNav() {
    const navOpen = this.state.getValue().navOpen;
    this.state.next({
      ...this.state.getValue(),
      navOpen: !navOpen,
    });
  }
}
