import { describe, expect, it } from "vitest";
import { normalizeUrl } from "./url";

describe("normalizeUrl", () => {
  it("adds HTTPS when the scheme is omitted", () => {
    expect(normalizeUrl("example.com")).toBe("https://example.com/");
  });

  it("keeps valid HTTP localhost URLs", () => {
    expect(normalizeUrl("http://localhost:3000/path")).toBe("http://localhost:3000/path");
  });

  it("rejects invalid and unsafe protocols", () => {
    expect(normalizeUrl("not a url")).toBeNull();
    expect(normalizeUrl("javascript:alert(1)")).toBeNull();
    expect(normalizeUrl("")).toBeNull();
  });
});
