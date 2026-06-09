import {
  Clipboard,
  getPreferenceValues,
  getSelectedText,
  List,
  LocalStorage,
} from "@raycast/api";
import { useEffect, useState } from "react";

import {
  ErrorView,
  ModelInfoItem,
  VariantItem,
} from "./components/improve-text-items";
import { UserFacingError } from "./lib/errors";
import { resolveInputText, type ResolvedInput } from "./lib/input";
import {
  resolveOpenAIModel,
  SELECTED_OPENAI_MODEL_STORAGE_KEY,
} from "./lib/model";
import { generateVariants } from "./lib/openai";
import { copySelectedTextWithKeyboardShortcut } from "./lib/selection";
import type { VariantResult } from "./lib/variants";

type Preferences = {
  openaiApiKey: string;
  model: string;
};

type ViewState =
  | { status: "loading" }
  | { status: "error"; error: UserFacingError }
  | {
      status: "ready";
      input: ResolvedInput;
      model: string;
      variants: VariantResult[];
    };

export default function Command() {
  const [state, setState] = useState<ViewState>({ status: "loading" });

  async function load() {
    setState({ status: "loading" });
    const preferences = getPreferenceValues<Preferences>();

    try {
      const input = await resolveInputText({
        getSelectedText,
        copySelectedText: () =>
          copySelectedTextWithKeyboardShortcut({
            readClipboardText: Clipboard.readText,
          }),
        readClipboardText: Clipboard.readText,
      });
      const model = resolveOpenAIModel({
        storedModel: await LocalStorage.getItem<string>(
          SELECTED_OPENAI_MODEL_STORAGE_KEY,
        ),
        preferenceModel: preferences.model,
      });
      const variants = await generateVariants({
        apiKey: preferences.openaiApiKey,
        model,
        sourceText: input.text,
      });
      setState({ status: "ready", input, model, variants });
    } catch (error) {
      if (error instanceof UserFacingError) {
        setState({ status: "error", error });
        return;
      }

      setState({
        status: "error",
        error: new UserFacingError(
          "unknown",
          "Неожиданная ошибка",
          "Попробуй запустить команду ещё раз.",
        ),
      });
    }
  }

  useEffect(() => {
    void load();
  }, []);

  if (state.status === "error") {
    return <ErrorView error={state.error} onRetry={() => void load()} />;
  }

  return (
    <List
      isLoading={state.status === "loading"}
      isShowingDetail={state.status === "ready"}
    >
      {state.status === "ready" ? (
        <>
          {state.variants.map((variant) => (
            <VariantItem
              key={variant.id}
              input={state.input}
              variant={variant}
              variants={state.variants}
              onRegenerate={load}
            />
          ))}
          <List.Section title="Using Model">
            <ModelInfoItem model={state.model} onRegenerate={load} />
          </List.Section>
        </>
      ) : null}
    </List>
  );
}
