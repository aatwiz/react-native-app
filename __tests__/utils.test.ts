import { generateId, formatDate, truncate } from "../src/utils";

describe("generateId", () => {
  it("returns a string of 36 characters (UUID format)", () => {
    const id = generateId();
    expect(id).toHaveLength(36);
    expect(id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
    );
  });

  it("generates unique IDs", () => {
    const ids = new Set(Array.from({ length: 100 }, () => generateId()));
    expect(ids.size).toBe(100);
  });
});

describe("truncate", () => {
  it("returns the original string if shorter than maxLen", () => {
    expect(truncate("hello", 10)).toBe("hello");
  });

  it("truncates and adds ellipsis if longer than maxLen", () => {
    expect(truncate("hello world", 8)).toBe("hello w…");
  });

  it("handles exact length", () => {
    expect(truncate("hello", 5)).toBe("hello");
  });
});

describe("formatDate", () => {
  it('returns "Just now" for very recent dates', () => {
    const now = new Date().toISOString();
    expect(formatDate(now)).toBe("Just now");
  });

  it("returns minutes ago for recent dates", () => {
    const fiveMinAgo = new Date(Date.now() - 5 * 60_000).toISOString();
    expect(formatDate(fiveMinAgo)).toBe("5m ago");
  });

  it("returns hours ago for same-day dates", () => {
    const threeHoursAgo = new Date(
      Date.now() - 3 * 3_600_000
    ).toISOString();
    expect(formatDate(threeHoursAgo)).toBe("3h ago");
  });
});
