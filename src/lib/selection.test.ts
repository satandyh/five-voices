import { describe, expect, it, vi } from "vitest";

import { copySelectedTextWithKeyboardShortcut } from "./selection";

describe("copySelectedTextWithKeyboardShortcut", () => {
  it("copies selection with a layout-independent physical Cmd+C key code", async () => {
    const runAppleScript = vi.fn().mockResolvedValue(undefined);
    const readClipboardText = vi
      .fn()
      .mockResolvedValueOnce("old clipboard")
      .mockResolvedValueOnce("selected text");

    const text = await copySelectedTextWithKeyboardShortcut({
      readClipboardText,
      runAppleScript,
      wait: vi.fn().mockResolvedValue(undefined),
    });

    expect(text).toBe("selected text");
    expect(runAppleScript).toHaveBeenCalledWith(
      expect.stringContaining("key code 8 using {command down}"),
    );
  });

  it("returns empty text when the clipboard did not change", async () => {
    const text = await copySelectedTextWithKeyboardShortcut({
      readClipboardText: vi.fn().mockResolvedValue("old clipboard"),
      runAppleScript: vi.fn().mockResolvedValue(undefined),
      wait: vi.fn().mockResolvedValue(undefined),
    });

    expect(text).toBe("");
  });
});
