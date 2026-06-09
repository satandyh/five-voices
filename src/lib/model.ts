import { DEFAULT_OPENAI_MODEL } from "./app-config";

export {
  DEFAULT_OPENAI_MODEL,
  SELECTED_OPENAI_MODEL_STORAGE_KEY,
} from "./app-config";

export function resolveOpenAIModel({
  storedModel,
  preferenceModel,
}: {
  storedModel: string | undefined;
  preferenceModel: string | undefined;
}): string {
  const trimmedStoredModel = storedModel?.trim() ?? "";
  if (trimmedStoredModel.length > 0) {
    return trimmedStoredModel;
  }

  const trimmedPreferenceModel = preferenceModel?.trim() ?? "";
  if (trimmedPreferenceModel.length > 0) {
    return trimmedPreferenceModel;
  }

  return DEFAULT_OPENAI_MODEL;
}
