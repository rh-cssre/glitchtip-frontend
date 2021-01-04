import { DaysAgoPipe } from "./days-ago.pipe";

describe("DateAgoPipe", () => {
  const pipe = new DaysAgoPipe();

  it("create an instance", () => {
    expect(pipe).toBeTruthy();
  });

  it("a valid date returns days difference", () => {
    const mockFirstSeen = "2019-12-09T14:22:51.793749Z";
    // mockCurrentDate is for January 9, 2020
    const mockCurrentDate = 1578579771793;
    const baseTime = new Date(mockCurrentDate);
    jasmine.clock().mockDate(baseTime);
    expect(pipe.transform(mockFirstSeen)).toBe("1 month ago");
  });

  it("an invalid date does not transform the value", () => {
    expect(pipe.transform("fake")).toBe("");
  });
});
