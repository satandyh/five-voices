import {
  Action,
  ActionPanel,
  getPreferenceValues,
  List,
  LocalStorage,
  openExtensionPreferences,
  showToast,
  Toast,
} from "@raycast/api";
import { useEffect, useState } from "react";

import { UserFacingError } from "./lib/errors";
import {
  resolveOpenAIModel,
  SELECTED_OPENAI_MODEL_STORAGE_KEY,
} from "./lib/model";
import { listOpenAIModels } from "./lib/openai";

type Preferences = {
  openaiApiKey: string;
  model: string;
};

type ViewState =
  | { status: "loading" }
  | { status: "error"; error: UserFacingError }
  | { status: "ready"; models: string[]; selectedModel: string };

export default function Command() {
  const [state, setState] = useState<ViewState>({ status: "loading" });

  async function load() {
    setState({ status: "loading" });
    const preferences = getPreferenceValues<Preferences>();

    try {
      const [models, storedModel] = await Promise.all([
        listOpenAIModels({ apiKey: preferences.openaiApiKey }),
        LocalStorage.getItem<string>(SELECTED_OPENAI_MODEL_STORAGE_KEY),
      ]);

      setState({
        status: "ready",
        models,
        selectedModel: resolveOpenAIModel({
          storedModel,
          preferenceModel: preferences.model,
        }),
      });
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
          "Попробуй обновить список моделей ещё раз.",
        ),
      });
    }
  }

  useEffect(() => {
    void load();
  }, []);

  if (state.status === "error") {
    return (
      <List>
        <List.EmptyView
          title={state.error.title}
          description={state.error.message}
          actions={
            <ActionPanel>
              <Action title="Try Again" onAction={() => void load()} />
              {state.error.code === "missing_api_key" ? (
                <Action
                  title="Open Extension Preferences"
                  onAction={() => void openExtensionPreferences()}
                />
              ) : null}
            </ActionPanel>
          }
        />
      </List>
    );
  }

  return (
    <List
      isLoading={state.status === "loading"}
      searchBarPlaceholder="Search OpenAI models"
    >
      {state.status === "ready"
        ? state.models.map((model) => (
            <ModelItem
              key={model}
              model={model}
              isSelected={model === state.selectedModel}
              onSelect={async () => {
                await LocalStorage.setItem(
                  SELECTED_OPENAI_MODEL_STORAGE_KEY,
                  model,
                );
                await showToast({
                  style: Toast.Style.Success,
                  title: "OpenAI Model Saved",
                  message: model,
                });
                setState({
                  status: "ready",
                  models: state.models,
                  selectedModel: model,
                });
              }}
              onClear={async () => {
                await LocalStorage.removeItem(
                  SELECTED_OPENAI_MODEL_STORAGE_KEY,
                );
                await showToast({
                  style: Toast.Style.Success,
                  title: "OpenAI Model Reset",
                  message: "Using Settings fallback",
                });
                await load();
              }}
            />
          ))
        : null}
    </List>
  );
}

function ModelItem({
  model,
  isSelected,
  onSelect,
  onClear,
}: {
  model: string;
  isSelected: boolean;
  onSelect: () => Promise<void>;
  onClear: () => Promise<void>;
}) {
  return (
    <List.Item
      title={model}
      accessories={isSelected ? [{ text: "Selected" }] : undefined}
      actions={
        <ActionPanel>
          <Action title="Use This Model" onAction={() => void onSelect()} />
          {isSelected ? (
            <Action title="Clear Saved Model" onAction={() => void onClear()} />
          ) : null}
        </ActionPanel>
      }
    />
  );
}
