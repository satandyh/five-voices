import { describe, expect, it } from "vitest";

import { UserFacingError } from "./errors";
import { parseVariantsJson } from "./parse";

describe("parseVariantsJson", () => {
  it("parses exactly five variants in approved order", () => {
    const variants = parseVariantsJson(
      JSON.stringify({
        variants: [
          { id: "editor_literary", text: "Литературный текст" },
          { id: "meaning_first", text: "Коротко" },
          { id: "with_character", text: "С характером" },
          { id: "smart_stenographer", text: "Стенограмма" },
          { id: "speech_to_text", text: "Разговор" },
        ],
      }),
    );

    expect(variants).toEqual([
      { id: "editor_literary", text: "Литературный текст" },
      { id: "meaning_first", text: "Коротко" },
      { id: "with_character", text: "С характером" },
      { id: "smart_stenographer", text: "Стенограмма" },
      { id: "speech_to_text", text: "Разговор" },
    ]);
  });

  it("rejects invalid JSON with invalid_json", () => {
    expect(() => parseVariantsJson("{bad json")).toThrow(UserFacingError);

    try {
      parseVariantsJson("{bad json");
    } catch (error) {
      expect((error as UserFacingError).code).toBe("invalid_json");
    }
  });

  it("returns variants in approved order when JSON contains the right ids in another order", () => {
    const variants = parseVariantsJson(
      JSON.stringify({
        variants: [
          { id: "with_character", text: "С характером" },
          { id: "editor_literary", text: "Литературный текст" },
          { id: "speech_to_text", text: "Разговор" },
          { id: "meaning_first", text: "Коротко" },
          { id: "smart_stenographer", text: "Стенограмма" },
        ],
      }),
    );

    expect(variants.map((variant) => variant.id)).toEqual([
      "editor_literary",
      "meaning_first",
      "with_character",
      "smart_stenographer",
      "speech_to_text",
    ]);
  });

  it("rejects missing, extra, duplicate, unknown, or empty variants", () => {
    const invalidBodies = [
      { variants: [] },
      { variants: [{ id: "editor_literary", text: "ok" }] },
      {
        variants: [
          { id: "editor_literary", text: "ok" },
          { id: "editor_literary", text: "duplicate" },
          { id: "with_character", text: "ok" },
          { id: "smart_stenographer", text: "ok" },
          { id: "speech_to_text", text: "ok" },
        ],
      },
      {
        variants: [
          { id: "editor_literary", text: "ok" },
          { id: "meaning_first", text: "ok" },
          { id: "unknown", text: "bad id" },
          { id: "smart_stenographer", text: "ok" },
          { id: "speech_to_text", text: "ok" },
        ],
      },
      {
        variants: [
          { id: "editor_literary", text: "" },
          { id: "meaning_first", text: "ok" },
          { id: "with_character", text: "ok" },
          { id: "smart_stenographer", text: "ok" },
          { id: "speech_to_text", text: "ok" },
        ],
      },
      {
        variants: [
          { id: "literary", text: "old id" },
          { id: "meaning_first", text: "ok" },
          { id: "with_character", text: "ok" },
          { id: "smart_stenographer", text: "ok" },
          { id: "speech_to_text", text: "ok" },
        ],
      },
    ];

    for (const body of invalidBodies) {
      expect(() => parseVariantsJson(JSON.stringify(body))).toThrow(
        UserFacingError,
      );
    }
  });
});
