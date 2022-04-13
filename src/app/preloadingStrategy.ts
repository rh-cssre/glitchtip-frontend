import { PreloadingStrategy, Route } from "@angular/router";
import { Injectable } from "@angular/core";
import { Observable, EMPTY, timer, map } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class CustomPreloadingStrategy implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<any>): Observable<any> {
    if (shouldPreload(route)) {
      // Delay to give priority to API data and other assets
      return timer(1000).pipe(map(() => load()));
    } else {
      return EMPTY;
    }
  }
}

/** Guess if user would prefer to preload based on network/device */
export function shouldPreload(route: Route): boolean {
  const conn = navigator.connection;
  if (conn) {
    if ((conn as any).saveData) {
      return false;
    }

    if ("effectiveType" in navigator.connection) {
      if (["slow-2g", "2g", "3g"].includes((conn as any).effectiveType)) {
        return false;
      }
      return true;
    }

    if (/Android|iPhone/i.test(navigator.userAgent)) {
      return false;
    }
  }
  return true;
}
