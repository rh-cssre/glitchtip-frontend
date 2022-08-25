import { generateIconPath } from "./shared.utils";

describe("Icon Paths", () => {
  it("unknown path returns undefined", () => {
    const unknownString = generateIconPath("icon path");
    expect(unknownString).toBeUndefined();
  });

  it("generates path to os library", () => {
    const redHat = generateIconPath("Red Hat");
    expect(redHat).toBe("static/assets/images/os-logos/RHT.png");
  });

  it("generates path to browser logo library", () => {
    const opera = generateIconPath("Opera");
    expect(opera).toBe("static/assets/images/browser-svgs/opera/opera.svg");
  });

  it("generates path to local library", () => {
    const cPython = generateIconPath("C Python");
    expect(cPython).toBe("static/assets/images/logos/48x48/python.svg");
  });
});
