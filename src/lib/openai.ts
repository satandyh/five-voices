import {
  DEFAULT_OPENAI_MODEL,
  OPENAI_JSON_SCHEMA_NAME,
  OPENAI_MODELS_URL,
  OPENAI_RESPONSES_URL,
} from "./app-config";
import {
  invalidResponseError,
  missingApiKeyError,
  networkError,
  unauthorizedError,
  unknownApiError,
} from "./errors";
import { parseVariantsJson } from "./parse";
import { buildFiveVariantsPrompt } from "./prompt";
import { VARIANT_IDS, type VariantResult } from "./variants";

type GenerateVariantsArgs = {
  apiKey: string;
  model: string;
  sourceText: string;
  fetchImpl?: typeof fetch;
};

type ResponsesApiBody = {
  output_text?: unknown;
  output?: unknown;
};

type ListModelsArgs = {
  apiKey: string;
  fetchImpl?: typeof fetch;
};

type ListModelsApiBody = {
  data?: unknown;
};

export async function generateVariants({
  apiKey,
  model,
  sourceText,
  fetchImpl = fetch,
}: GenerateVariantsArgs): Promise<VariantResult[]> {
  const trimmedApiKey = apiKey.trim();
  if (trimmedApiKey.length === 0) {
    throw missingApiKeyError();
  }

  let response: Response;
  try {
    response = await fetchImpl(OPENAI_RESPONSES_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${trimmedApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: model.trim() || DEFAULT_OPENAI_MODEL,
        input: buildFiveVariantsPrompt(sourceText),
        text: {
          format: {
            type: "json_schema",
            name: OPENAI_JSON_SCHEMA_NAME,
            strict: true,
            schema: {
              type: "object",
              additionalProperties: false,
              required: ["variants"],
              properties: {
                variants: {
                  type: "array",
                  minItems: 5,
                  maxItems: 5,
                  items: {
                    type: "object",
                    additionalProperties: false,
                    required: ["id", "text"],
                    properties: {
                      id: {
                        type: "string",
                        enum: VARIANT_IDS,
                      },
                      text: {
                        type: "string",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      }),
    });
  } catch {
    throw networkError();
  }

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw unauthorizedError();
    }
    throw unknownApiError();
  }

  const body = (await response.json()) as ResponsesApiBody;
  const outputText = extractResponseText(body);
  if (outputText === undefined) {
    throw invalidResponseError();
  }

  return parseVariantsJson(outputText);
}

export async function listOpenAIModels({
  apiKey,
  fetchImpl = fetch,
}: ListModelsArgs): Promise<string[]> {
  const trimmedApiKey = apiKey.trim();
  if (trimmedApiKey.length === 0) {
    throw missingApiKeyError();
  }

  let response: Response;
  try {
    response = await fetchImpl(OPENAI_MODELS_URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${trimmedApiKey}`,
      },
    });
  } catch {
    throw networkError();
  }

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw unauthorizedError();
    }
    throw unknownApiError();
  }

  const body = (await response.json()) as ListModelsApiBody;
  if (!Array.isArray(body.data)) {
    throw invalidResponseError();
  }

  return Array.from(
    new Set(
      body.data
        .map((item) => (isRecord(item) ? item.id : undefined))
        .filter((id): id is string => typeof id === "string" && id.length > 0),
    ),
  ).sort((left, right) => left.localeCompare(right));
}

function extractResponseText(body: ResponsesApiBody): string | undefined {
  if (
    typeof body.output_text === "string" &&
    body.output_text.trim().length > 0
  ) {
    return body.output_text;
  }

  if (!Array.isArray(body.output)) {
    return undefined;
  }

  for (const outputItem of body.output) {
    if (!isRecord(outputItem) || !Array.isArray(outputItem.content)) {
      continue;
    }

    for (const contentItem of outputItem.content) {
      if (
        isRecord(contentItem) &&
        contentItem.type === "output_text" &&
        typeof contentItem.text === "string"
      ) {
        return contentItem.text;
      }
    }
  }

  return undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
