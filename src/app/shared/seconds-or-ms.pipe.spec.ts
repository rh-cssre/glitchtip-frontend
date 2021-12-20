import { SecondsOrMSPipe } from "./seconds-or-ms.pipe";

describe("SecondsOrMSPipe", () => {
  const secondsOrMSPipe = new SecondsOrMSPipe

  it("create an instance", () => {
    expect(secondsOrMSPipe).toBeTruthy();
  });

  it("returns a time delta as either seconds or milliseconds", () => {
    const msDuration = "0:00:00.063595"
    const secondsDuration = "0:00:01.063595"

    expect(secondsOrMSPipe.transform(msDuration)).toBe("64ms")
    expect(secondsOrMSPipe.transform(secondsDuration)).toBe("1.06 seconds")
  });

  it("an invalid duration does not transform the value", () => {
    expect(secondsOrMSPipe.transform("fake")).toBe("");
  });
});
