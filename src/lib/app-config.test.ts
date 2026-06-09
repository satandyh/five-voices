import { describe, expect, it } from "vitest";

import {
  DEFAULT_OPENAI_MODEL,
  HARD_INPUT_CHARACTER_LIMIT,
  OPENAI_JSON_SCHEMA_NAME,
  OPENAI_MODELS_URL,
  OPENAI_RESPONSES_URL,
  SELECTED_OPENAI_MODEL_STORAGE_KEY,
  WARNING_INPUT_CHARACTER_LIMIT,
} from "./app-config";

describe("app config", () => {
  it("keeps human-editable defaults in one place", () => {
    expect(DEFAULT_OPENAI_MODEL).toBe("gpt-5.4-mini");
    expect(WARNING_INPUT_CHARACTER_LIMIT).toBe(120_000);
    expect(HARD_INPUT_CHARACTER_LIMIT).toBe(300_000);
    expect(SELECTED_OPENAI_MODEL_STORAGE_KEY).toBe("selectedOpenAIModel");
  });

  it("keeps OpenAI API constants in one place", () => {
    expect(OPENAI_RESPONSES_URL).toBe("https://api.openai.com/v1/responses");
    expect(OPENAI_MODELS_URL).toBe("https://api.openai.com/v1/models");
    expect(OPENAI_JSON_SCHEMA_NAME).toBe("five_text_variants");
  });
});
