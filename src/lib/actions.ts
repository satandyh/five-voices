import type { ResolvedInput } from "./input";

export function canReplaceSource(input: ResolvedInput): boolean {
  return input.source === "selection";
}
