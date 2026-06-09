import { describe, expect, it, vi } from "vitest";

import { EmptyInputError, InputTooLargeError } from "./errors";
import { normalizeSourceText, resolveInputText } from "./input";
import { HARD_INPUT_CHARACTER_LIMIT } from "./limits";

describe("normalizeSourceText", () => {
  it("normalizes line endings and trims outer whitespace", () => {
    expect(normalizeSourceText("  one\r\ntwo\rthree\n\n  ")).toBe(
      "one\ntwo\nthree",
    );
  });

  it("keeps internal paragraph spacing", () => {
    expect(normalizeSourceText("one\n\n\ntwo")).toBe("one\n\n\ntwo");
  });
});

describe("resolveInputText", () => {
  it("uses selected text before clipboard text", async () => {
    const result = await resolveInputText({
      getSelectedText: vi.fn().mockResolvedValue(" selected "),
      readClipboardText: vi.fn().mockResolvedValue(" clipboard "),
    });

    expect(result).toEqual({ source: "selection", text: "selected" });
  });

  it("falls back to clipboard when selection is unavailable", async () => {
    const result = await resolveInputText({
      getSelectedText: vi.fn().mockRejectedValue(new Error("No selection")),
      readClipboardText: vi.fn().mockResolvedValue(" clipboard "),
    });

    expect(result).toEqual({ source: "clipboard", text: "clipboard" });
  });

  it("uses keyboard-copied selected text before clipboard when getSelectedText fails", async () => {
    const result = await resolveInputText({
      getSelectedText: vi.fn().mockRejectedValue(new Error("Wrong layout")),
      copySelectedText: vi.fn().mockResolvedValue(" selected via key code "),
      readClipboardText: vi.fn().mockResolvedValue(" old clipboard "),
    });

    expect(result).toEqual({
      source: "selection",
      text: "selected via key code",
    });
  });

  it("falls back to clipboard when selection is whitespace", async () => {
    const result = await resolveInputText({
      getSelectedText: vi.fn().mockResolvedValue("   "),
      copySelectedText: vi
        .fn()
        .mockResolvedValue(" selected after whitespace "),
      readClipboardText: vi.fn().mockResolvedValue(" clipboard "),
    });

    expect(result).toEqual({
      source: "selection",
      text: "selected after whitespace",
    });
  });

  it("falls back to clipboard when keyboard-copied selected text is unavailable", async () => {
    const result = await resolveInputText({
      getSelectedText: vi.fn().mockRejectedValue(new Error("No selection")),
      copySelectedText: vi.fn().mockResolvedValue(" "),
      readClipboardText: vi.fn().mockResolvedValue(" clipboard "),
    });

    expect(result).toEqual({ source: "clipboard", text: "clipboard" });
  });

  it("throws EmptyInputError when both sources are empty", async () => {
    await expect(
      resolveInputText({
        getSelectedText: vi.fn().mockRejectedValue(new Error("No selection")),
        copySelectedText: vi.fn().mockResolvedValue(" "),
        readClipboardText: vi.fn().mockResolvedValue(" "),
      }),
    ).rejects.toBeInstanceOf(EmptyInputError);
  });

  it("throws InputTooLargeError when selected text is above the hard limit", async () => {
    await expect(
      resolveInputText({
        getSelectedText: vi
          .fn()
          .mockResolvedValue("a".repeat(HARD_INPUT_CHARACTER_LIMIT + 1)),
        copySelectedText: vi.fn().mockResolvedValue(" "),
        readClipboardText: vi.fn().mockResolvedValue("clipboard"),
      }),
    ).rejects.toBeInstanceOf(InputTooLargeError);
  });

  it("throws InputTooLargeError when clipboard text is above the hard limit", async () => {
    await expect(
      resolveInputText({
        getSelectedText: vi.fn().mockRejectedValue(new Error("No selection")),
        copySelectedText: vi.fn().mockResolvedValue(" "),
        readClipboardText: vi
          .fn()
          .mockResolvedValue("a".repeat(HARD_INPUT_CHARACTER_LIMIT + 1)),
      }),
    ).rejects.toBeInstanceOf(InputTooLargeError);
  });
});
