import { describe, expect, it } from "vitest";

import { canReplaceSource } from "./actions";

describe("canReplaceSource", () => {
  it("allows replacement for selected text", () => {
    expect(canReplaceSource({ source: "selection", text: "hello" })).toBe(true);
  });

  it("disables replacement for clipboard text", () => {
    expect(canReplaceSource({ source: "clipboard", text: "hello" })).toBe(
      false,
    );
  });
});
