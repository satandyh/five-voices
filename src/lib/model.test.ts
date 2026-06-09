import { describe, expect, it } from "vitest";

import {
  DEFAULT_OPENAI_MODEL,
  SELECTED_OPENAI_MODEL_STORAGE_KEY,
  resolveOpenAIModel,
} from "./model";

describe("resolveOpenAIModel", () => {
  it("uses the stored model first", () => {
    expect(
      resolveOpenAIModel({
        storedModel: "gpt-new",
        preferenceModel: "gpt-5.4-mini",
      }),
    ).toBe("gpt-new");
  });

  it("falls back to the preference model", () => {
    expect(
      resolveOpenAIModel({
        storedModel: undefined,
        preferenceModel: " gpt-5.4 ",
      }),
    ).toBe("gpt-5.4");
  });

  it("falls back to the built-in default model", () => {
    expect(
      resolveOpenAIModel({
        storedModel: " ",
        preferenceModel: " ",
      }),
    ).toBe(DEFAULT_OPENAI_MODEL);
  });

  it("keeps a stable storage key", () => {
    expect(SELECTED_OPENAI_MODEL_STORAGE_KEY).toBe("selectedOpenAIModel");
  });
});
