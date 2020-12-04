import { generateIconPath } from "./shared.utils";

describe("Icon Paths", () => {
  it("unknown path returns undefined", () => {
    const unknownString = generateIconPath("icon path");
    expect(unknownString).toBeUndefined();
  });

  it("generates path to os library", () => {
    const redHat = generateIconPath("Red Hat");
    expect(redHat).toBe("assets/images/os-logos/red-hat.png");
  });

  it("generates path to browser logo library", () => {
    const opera = generateIconPath("Opera");
    expect(opera).toBe("assets/images/browser-svgs/opera/opera.svg");
  });

  it("generates path to browser logo archive library", () => {
    const internetExplorer = generateIconPath("Internet Explorer");
    expect(internetExplorer).toBe(
      "assets/images/browser-svgs/archive/internet-explorer-tile_10-11/internet-explorer-tile_10-11.svg"
    );
  });

  it("generates path to local library", () => {
    const cPython = generateIconPath("C Python");
    expect(cPython).toBe("assets/images/logos/48x48/cpython.png");
  });
});
