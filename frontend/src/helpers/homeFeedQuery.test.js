import { describe, expect, it } from "vitest";
import { normalizeSearchParams, toSearchParams } from "./homeFeedQuery";

describe("normalizeSearchParams", () => {
  describe("tab normalization", () => {
    it("should use default tab (feed) when authenticated and no tab provided", () => {
      const result = normalizeSearchParams({}, true);
      expect(result.tabName).toBe("feed");
      expect(result.tagName).toBe("");
      expect(result.pageIndex).toBe(0);
    });

    it("should use default tab (global) when not authenticated and no tab provided", () => {
      const result = normalizeSearchParams({}, false);
      expect(result.tabName).toBe("global");
      expect(result.tagName).toBe("");
      expect(result.pageIndex).toBe(0);
    });

    it("should accept valid tab names", () => {
      expect(normalizeSearchParams({ tab: "global" }, true).tabName).toBe("global");
      expect(normalizeSearchParams({ tab: "feed" }, true).tabName).toBe("feed");
      expect(normalizeSearchParams({ tab: "tag", tag: "react" }, true).tabName).toBe("tag");
    });

    it("should fallback to default for unknown tab name", () => {
      const result = normalizeSearchParams({ tab: "invalid" }, true);
      expect(result.tabName).toBe("feed");
    });

    it("should fallback to global when tab=feed but user not authenticated", () => {
      const result = normalizeSearchParams({ tab: "feed" }, false);
      expect(result.tabName).toBe("global");
    });
  });

  describe("tag validation", () => {
    it("should extract tag name when tab=tag and tag provided", () => {
      const result = normalizeSearchParams({ tab: "tag", tag: "react" }, true);
      expect(result.tabName).toBe("tag");
      expect(result.tagName).toBe("react");
    });

    it("should trim tag name whitespace", () => {
      const result = normalizeSearchParams({ tab: "tag", tag: "  react  " }, true);
      expect(result.tagName).toBe("react");
    });

    it("should fallback to default tab when tab=tag but no tag provided", () => {
      const result = normalizeSearchParams({ tab: "tag" }, true);
      expect(result.tabName).toBe("feed");
      expect(result.tagName).toBe("");
    });

    it("should fallback to default tab when tab=tag but tag is empty string", () => {
      const result = normalizeSearchParams({ tab: "tag", tag: "" }, false);
      expect(result.tabName).toBe("global");
      expect(result.tagName).toBe("");
    });

    it("should fallback to default tab when tab=tag but tag is whitespace only", () => {
      const result = normalizeSearchParams({ tab: "tag", tag: "   " }, true);
      expect(result.tabName).toBe("feed");
      expect(result.tagName).toBe("");
    });

    it("should not include tag name when tab is not tag", () => {
      const result = normalizeSearchParams({ tab: "global", tag: "react" }, true);
      expect(result.tabName).toBe("global");
      expect(result.tagName).toBe("");
    });
  });

  describe("page normalization", () => {
    it("should parse valid page number", () => {
      expect(normalizeSearchParams({ page: "0" }, true).pageIndex).toBe(0);
      expect(normalizeSearchParams({ page: "1" }, true).pageIndex).toBe(1);
      expect(normalizeSearchParams({ page: "10" }, true).pageIndex).toBe(10);
    });

    it("should default to 0 when page not provided", () => {
      expect(normalizeSearchParams({}, true).pageIndex).toBe(0);
    });

    it("should default to 0 for non-numeric page", () => {
      expect(normalizeSearchParams({ page: "abc" }, true).pageIndex).toBe(0);
      expect(normalizeSearchParams({ page: "NaN" }, true).pageIndex).toBe(0);
    });

    it("should default to 0 for negative page", () => {
      expect(normalizeSearchParams({ page: "-1" }, true).pageIndex).toBe(0);
      expect(normalizeSearchParams({ page: "-10" }, true).pageIndex).toBe(0);
    });

    it("should handle page as decimal by truncating", () => {
      expect(normalizeSearchParams({ page: "2.5" }, true).pageIndex).toBe(2);
      expect(normalizeSearchParams({ page: "3.9" }, true).pageIndex).toBe(3);
    });
  });

  describe("combined scenarios", () => {
    it("should handle complete valid URL state", () => {
      const result = normalizeSearchParams(
        { tab: "tag", tag: "react", page: "2" },
        true
      );
      expect(result).toEqual({
        tabName: "tag",
        tagName: "react",
        pageIndex: 2,
      });
    });

    it("should handle authenticated user on feed tab", () => {
      const result = normalizeSearchParams({ tab: "feed", page: "1" }, true);
      expect(result).toEqual({
        tabName: "feed",
        tagName: "",
        pageIndex: 1,
      });
    });

    it("should handle unauthenticated user with invalid tab=feed", () => {
      const result = normalizeSearchParams({ tab: "feed", page: "3" }, false);
      expect(result).toEqual({
        tabName: "global",
        tagName: "",
        pageIndex: 3,
      });
    });
  });
});

describe("toSearchParams", () => {
  it("should create params for global tab", () => {
    const result = toSearchParams({
      tabName: "global",
      tagName: "",
      pageIndex: 0,
    });
    expect(result).toEqual({ tab: "global" });
  });

  it("should create params for feed tab", () => {
    const result = toSearchParams({
      tabName: "feed",
      tagName: "",
      pageIndex: 0,
    });
    expect(result).toEqual({ tab: "feed" });
  });

  it("should create params for tag tab with tag name", () => {
    const result = toSearchParams({
      tabName: "tag",
      tagName: "react",
      pageIndex: 0,
    });
    expect(result).toEqual({ tab: "tag", tag: "react" });
  });

  it("should include page param when pageIndex > 0", () => {
    const result = toSearchParams({
      tabName: "global",
      tagName: "",
      pageIndex: 2,
    });
    expect(result).toEqual({ tab: "global", page: "2" });
  });

  it("should omit page param when pageIndex is 0", () => {
    const result = toSearchParams({
      tabName: "global",
      tagName: "",
      pageIndex: 0,
    });
    expect(result).toEqual({ tab: "global" });
  });

  it("should create complete params for tag with page", () => {
    const result = toSearchParams({
      tabName: "tag",
      tagName: "javascript",
      pageIndex: 3,
    });
    expect(result).toEqual({ tab: "tag", tag: "javascript", page: "3" });
  });

  it("should omit tag param when tabName is not tag", () => {
    const result = toSearchParams({
      tabName: "global",
      tagName: "react",
      pageIndex: 1,
    });
    expect(result).toEqual({ tab: "global", page: "1" });
  });

  it("should handle tag tab without tagName", () => {
    const result = toSearchParams({
      tabName: "tag",
      tagName: "",
      pageIndex: 0,
    });
    expect(result).toEqual({ tab: "tag" });
  });
});
