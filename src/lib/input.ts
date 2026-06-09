import { EmptyInputError } from "./errors";
import { validateInputSize } from "./limits";

export type InputSource = "selection" | "clipboard";

export type ResolvedInput = {
  source: InputSource;
  text: string;
};

type InputDependencies = {
  getSelectedText: () => Promise<string>;
  copySelectedText?: () => Promise<string | undefined>;
  readClipboardText: () => Promise<string | undefined>;
};

export function normalizeSourceText(value: string | undefined): string {
  return (value ?? "").replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim();
}

export async function resolveInputText(
  dependencies: InputDependencies,
): Promise<ResolvedInput> {
  let selectedText = "";
  try {
    selectedText = normalizeSourceText(await dependencies.getSelectedText());
  } catch {
    // Raycast rejects getSelectedText() when the frontmost app has no usable selection.
  }
  if (selectedText.length > 0) {
    validateInputSize(selectedText);
    return { source: "selection", text: selectedText };
  }

  if (dependencies.copySelectedText !== undefined) {
    try {
      selectedText = normalizeSourceText(await dependencies.copySelectedText());
    } catch {
      selectedText = "";
    }
    if (selectedText.length > 0) {
      validateInputSize(selectedText);
      return { source: "selection", text: selectedText };
    }
  }

  const clipboardText = normalizeSourceText(
    await dependencies.readClipboardText(),
  );
  if (clipboardText.length > 0) {
    validateInputSize(clipboardText);
    return { source: "clipboard", text: clipboardText };
  }

  throw new EmptyInputError();
}
