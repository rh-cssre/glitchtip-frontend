import { DaysAgoPipe, DaysOldPipe, TimeForPipe } from "./days-ago.pipe";

describe("DaysAgoPipe, DaysOldPipe and TimeForPipe", () => {
  const daysAgoPipe = new DaysAgoPipe();
  const daysOldPipe = new DaysOldPipe();
  const timeForPipe = new TimeForPipe();

  it("create an instance", () => {
    expect(daysAgoPipe).toBeTruthy();
    expect(daysOldPipe).toBeTruthy();
    expect(timeForPipe).toBeTruthy();
  });

  it("a valid date returns days difference", () => {
    const mockFirstSeen = "2019-12-09T14:22:51.793749Z";
    // mockCurrentDate is for January 9, 2020
    const mockCurrentDate = 1578579771793;
    const baseTime = new Date(mockCurrentDate);
    jasmine.clock().mockDate(baseTime);
    expect(daysAgoPipe.transform(mockFirstSeen)).toBe("1 month ago");
    expect(daysOldPipe.transform(mockFirstSeen)).toBe("1 month old");
    expect(timeForPipe.transform(mockFirstSeen)).toBe("for 1 month");
  });

  it("an invalid date does not transform the value", () => {
    expect(daysAgoPipe.transform("fake")).toBe("");
    expect(daysOldPipe.transform("fake")).toBe("");
    expect(timeForPipe.transform("fake")).toBe("");
  });
});
