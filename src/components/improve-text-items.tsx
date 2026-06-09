import {
  Action,
  ActionPanel,
  Detail,
  List,
  openExtensionPreferences,
  showToast,
  Toast,
} from "@raycast/api";

import { canReplaceSource } from "../lib/actions";
import { UserFacingError } from "../lib/errors";
import { formatAllVariantsForCopy } from "../lib/format";
import type { ResolvedInput } from "../lib/input";
import { VARIANT_DEFINITIONS, type VariantResult } from "../lib/variants";

export function ErrorView({
  error,
  onRetry,
}: {
  error: UserFacingError;
  onRetry: () => void;
}) {
  return (
    <Detail
      markdown={`# ${error.title}\n\n${error.message}`}
      actions={
        <ActionPanel>
          <Action title="Try Again" onAction={onRetry} />
          {error.code === "missing_api_key" ? (
            <Action
              title="Open Extension Preferences"
              onAction={() => void openExtensionPreferences()}
            />
          ) : null}
        </ActionPanel>
      }
    />
  );
}

export function ModelInfoItem({
  model,
  onRegenerate,
}: {
  model: string;
  onRegenerate: () => Promise<void>;
}) {
  return (
    <List.Item
      title={model}
      subtitle="OpenAI model for this generation"
      actions={
        <ActionPanel>
          <Action.CopyToClipboard title="Copy Model Name" content={model} />
          <Action title="Regenerate" onAction={() => void onRegenerate()} />
        </ActionPanel>
      }
    />
  );
}

export function VariantItem({
  input,
  variant,
  variants,
  onRegenerate,
}: {
  input: ResolvedInput;
  variant: VariantResult;
  variants: VariantResult[];
  onRegenerate: () => Promise<void>;
}) {
  const definition = VARIANT_DEFINITIONS.find((item) => item.id === variant.id);
  const title = definition?.title ?? variant.id;
  const subtitle = definition?.subtitle ?? "";

  return (
    <List.Item
      title={title}
      subtitle={subtitle}
      detail={<List.Item.Detail markdown={variant.text} />}
      actions={
        <ActionPanel>
          <Action.CopyToClipboard
            title="Copy Variant"
            content={variant.text}
            onCopy={() => {
              void showToast({
                style: Toast.Style.Success,
                title: "Copied",
                message: title,
              });
            }}
          />
          {canReplaceSource(input) ? (
            <Action.Paste
              title="Replace Selected Text"
              content={variant.text}
              shortcut={{ modifiers: ["cmd"], key: "return" }}
              onPaste={() => {
                void showToast({
                  style: Toast.Style.Success,
                  title: "Replaced Selected Text",
                  message: title,
                });
              }}
            />
          ) : null}
          <Action.CopyToClipboard
            title="Copy All Variants"
            content={formatAllVariantsForCopy(variants)}
          />
          <Action title="Regenerate" onAction={() => void onRegenerate()} />
        </ActionPanel>
      }
    />
  );
}
