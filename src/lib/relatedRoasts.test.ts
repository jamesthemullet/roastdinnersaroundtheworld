import { describe, expect, it } from "vitest";
import { findRelatedRoasts, type RoastPost } from "./relatedRoasts";

const post = (slug: string, country: string): RoastPost => ({
  slug,
  title: slug,
  customfields: { country },
});

describe("findRelatedRoasts", () => {
  it("returns other posts sharing the same country", () => {
    const current = post("lisbon-carvery", "Portugal");
    const allPosts = [current, post("porto-grill", "Portugal"), post("paris-bistro", "France")];

    expect(findRelatedRoasts(current, allPosts)).toEqual([post("porto-grill", "Portugal")]);
  });

  it("excludes the current post itself", () => {
    const current = post("lisbon-carvery", "Portugal");
    const allPosts = [current];

    expect(findRelatedRoasts(current, allPosts)).toEqual([]);
  });

  it("excludes posts from a different country", () => {
    const current = post("lisbon-carvery", "Portugal");
    const allPosts = [current, post("paris-bistro", "France")];

    expect(findRelatedRoasts(current, allPosts)).toEqual([]);
  });

  it("returns an empty array when given no other posts", () => {
    const current = post("lisbon-carvery", "Portugal");

    expect(findRelatedRoasts(current, [])).toEqual([]);
  });

  it("returns every other post that matches, preserving input order", () => {
    const current = post("lisbon-carvery", "Portugal");
    const allPosts = [post("porto-grill", "Portugal"), current, post("faro-carvery", "Portugal")];

    expect(findRelatedRoasts(current, allPosts)).toEqual([
      post("porto-grill", "Portugal"),
      post("faro-carvery", "Portugal"),
    ]);
  });
});
