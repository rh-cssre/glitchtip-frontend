import { HumanizeDurationPipe } from "./seconds-or-ms.pipe";

describe("SecondsOrMSPipe", () => {
  const humanizeDurationPipe = new HumanizeDurationPipe();

  it("create an instance", () => {
    expect(humanizeDurationPipe).toBeTruthy();
  });

  it("returns a time delta as either seconds or milliseconds", () => {
    const msDuration = "0:00:00.063595";
    const secondsDuration = "0:00:01.063595";

    expect(humanizeDurationPipe.transform(msDuration)).toBe("64ms");
    expect(humanizeDurationPipe.transform(secondsDuration)).toBe(
      "1.06 seconds",
    );
  });

  it("an invalid duration does not transform the value", () => {
    expect(humanizeDurationPipe.transform("fake")).toBe("");
  });
});
