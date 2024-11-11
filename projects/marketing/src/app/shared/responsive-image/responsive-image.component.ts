import { Component, Input } from "@angular/core";

@Component({
  standalone: true,
  selector: "mkt-responsive-image",
  templateUrl: "./responsive-image.component.html",
})
export class ResponsiveImageComponent {
  @Input() alt: string | undefined;
  @Input() loading = "lazy";

  _webP: string | undefined;
  _main: string | undefined;
  _fallback: string | undefined;

  /**
   * Use `npm run transform-image` to get the images that this component uses
   * Use the @1x jpg/png as the value for src1x
   */
  @Input() set src1x(value: string) {
    const extension = value.split(".").pop();
    const filePath = value.split("@1x")[0];
    this._webP = [
      `${filePath}@1x.webp\n`,
      `${filePath}@2x.webp 2x\n`,
      `${filePath}@3x.webp 3x`,
    ].join(",");
    this._main = [
      `${filePath}@1x.${extension}\n`,
      `${filePath}@2x.${extension} 2x\n`,
      `${filePath}@3x.${extension} 3x`,
    ].join(",");
    this._fallback = value;
  }

  get webPSrcset() {
    return this._webP || "";
  }

  get mainSrcset() {
    return this._main || "";
  }

  get fallbackSrc() {
    return this._fallback || "";
  }

  constructor() {}
}
