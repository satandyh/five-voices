import { VARIANT_DEFINITIONS, type VariantResult } from "./variants";

export function formatAllVariantsForCopy(variants: VariantResult[]): string {
  const titleById = new Map(
    VARIANT_DEFINITIONS.map((variant) => [variant.id, variant.title]),
  );

  return variants
    .map((variant) =>
      [`=== ${titleById.get(variant.id) ?? variant.id} ===`, variant.text].join(
        "\n",
      ),
    )
    .join("\n\n");
}
