import { Injectable, inject } from "@angular/core";
import { RouterStateSnapshot, TitleStrategy } from "@angular/router";
import { SeoService } from "./seo.service";

@Injectable({ providedIn: "root" })
export class SeoTitleStrategy extends TitleStrategy {
  private seo = inject(SeoService);

  override updateTitle(snapshot: RouterStateSnapshot) {
    this.seo.setPageSeo({ title: this.buildTitle(snapshot) });
  }
}
