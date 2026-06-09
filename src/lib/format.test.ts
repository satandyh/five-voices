import { describe, expect, it } from "vitest";

import { formatAllVariantsForCopy } from "./format";

describe("formatAllVariantsForCopy", () => {
  it("formats all variants with Russian headings", () => {
    expect(
      formatAllVariantsForCopy([
        { id: "editor_literary", text: "A" },
        { id: "meaning_first", text: "B" },
        { id: "with_character", text: "C" },
        { id: "smart_stenographer", text: "D" },
        { id: "speech_to_text", text: "E" },
      ]),
    ).toBe(
      [
        "=== Редактор-литератор ===",
        "A",
        "",
        "=== Смысл важнее формы ===",
        "B",
        "",
        "=== С характером ===",
        "C",
        "",
        "=== Умный стенографист ===",
        "D",
        "",
        "=== Разговор → текст ===",
        "E",
      ].join("\n"),
    );
  });
});
