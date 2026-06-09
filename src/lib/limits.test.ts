import { describe, expect, it } from "vitest";

import { InputTooLargeError } from "./errors";
import { HARD_INPUT_CHARACTER_LIMIT, validateInputSize } from "./limits";

describe("validateInputSize", () => {
  it("accepts text at the hard character limit", () => {
    expect(() =>
      validateInputSize("a".repeat(HARD_INPUT_CHARACTER_LIMIT)),
    ).not.toThrow();
  });

  it("throws InputTooLargeError above the hard character limit", () => {
    expect(() =>
      validateInputSize("a".repeat(HARD_INPUT_CHARACTER_LIMIT + 1)),
    ).toThrow(InputTooLargeError);
  });
});
