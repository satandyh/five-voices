import { describe, expect, test } from "vitest";

import { VARIANT_DEFINITIONS, VARIANT_IDS } from "./variants";

describe("variant metadata", () => {
  test("keeps variant ids in the approved order", () => {
    expect(VARIANT_IDS).toEqual([
      "editor_literary",
      "meaning_first",
      "with_character",
      "smart_stenographer",
      "speech_to_text",
    ]);
  });

  test("keeps variant titles in the approved order", () => {
    expect(VARIANT_DEFINITIONS.map((definition) => definition.title)).toEqual([
      "Редактор-литератор",
      "Смысл важнее формы",
      "С характером",
      "Умный стенографист",
      "Разговор → текст",
    ]);
  });

  test("defines exactly five variants with compact subtitles", () => {
    expect(VARIANT_DEFINITIONS).toHaveLength(5);
    expect(
      VARIANT_DEFINITIONS.every(
        (definition) =>
          definition.subtitle.length > 0 && definition.subtitle.length <= 24,
      ),
    ).toBe(true);
  });
});
