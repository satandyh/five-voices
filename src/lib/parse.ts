import { invalidJsonError, invalidResponseError } from "./errors";
import { VARIANT_IDS, type VariantResult } from "./variants";

type UnknownVariant = {
  id?: unknown;
  text?: unknown;
};

type UnknownResponse = {
  variants?: unknown;
};

export function parseVariantsJson(rawJson: string): VariantResult[] {
  let parsed: UnknownResponse;

  try {
    parsed = JSON.parse(rawJson) as UnknownResponse;
  } catch {
    throw invalidJsonError();
  }

  if (
    !Array.isArray(parsed.variants) ||
    parsed.variants.length !== VARIANT_IDS.length
  ) {
    throw invalidResponseError();
  }

  const variantsById = new Map<string, string>();
  for (const variant of parsed.variants as UnknownVariant[]) {
    if (
      typeof variant.id !== "string" ||
      typeof variant.text !== "string" ||
      variant.text.trim().length === 0
    ) {
      throw invalidResponseError();
    }

    if (variantsById.has(variant.id)) {
      throw invalidResponseError();
    }

    variantsById.set(variant.id, variant.text.trim());
  }

  return VARIANT_IDS.map((id) => {
    const text = variantsById.get(id);
    if (text === undefined) {
      throw invalidResponseError();
    }

    return { id, text };
  });
}
