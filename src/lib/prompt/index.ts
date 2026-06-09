import { FIVE_VARIANTS_PROMPT_TEMPLATE } from "./prompt-template";

export function buildFiveVariantsPrompt(sourceText: string): string {
  return [FIVE_VARIANTS_PROMPT_TEMPLATE, sourceText].join("\n");
}
