import { describe, it, expect } from "vitest";
import { normalizeOptionalText } from "./normalizeOptionalText";

describe("normalizeOptionalText", () => {
  it("returns null for null, undefined, empty, whitespace", () => {
    expect(normalizeOptionalText(null)).toBeNull();
    expect(normalizeOptionalText(undefined)).toBeNull();
    expect(normalizeOptionalText("")).toBeNull();
    expect(normalizeOptionalText("   ")).toBeNull();
  });

  it('returns null for literal string "null"', () => {
    expect(normalizeOptionalText("null")).toBeNull();
    expect(normalizeOptionalText("NULL")).toBeNull();
  });

  it("trims and keeps real content", () => {
    expect(normalizeOptionalText("  hello  ")).toBe("hello");
    expect(normalizeOptionalText("stripe")).toBe("stripe");
  });
});
