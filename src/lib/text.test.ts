import { describe, expect, it } from "vitest";
import { cleanExcerpt } from "./text";

describe("cleanExcerpt", () => {
  it("strips a trailing WordPress excerpt marker", () => {
    expect(cleanExcerpt("Our trip to Lisbon was amazing […]")).toBe(
      "Our trip to Lisbon was amazing"
    );
  });

  it("leaves text without the marker unchanged", () => {
    expect(cleanExcerpt("A complete sentence.")).toBe("A complete sentence.");
  });

  it("returns undefined input as-is", () => {
    expect(cleanExcerpt(undefined)).toBeUndefined();
  });

  it("returns an empty string as-is", () => {
    expect(cleanExcerpt("")).toBe("");
  });
});
