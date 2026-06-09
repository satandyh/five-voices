# Five Variants Raycast Extension

Raycast extension that turns selected or copied rough text into five copy-ready editing variants:

1. Редактор-литератор
2. Смысл важнее формы
3. С характером
4. Умный стенографист
5. Разговор → текст

The extension does not require Raycast Pro. It uses your OpenAI API key stored as a Raycast password preference.

## Setup

From this folder, install dependencies and build the extension:

```bash
cd five-variants-raycast
```

Install dependencies:

```bash
npm install
```

Build and install the extension locally for Raycast:

```bash
npm run build
```

For development, run:

```bash
npm run dev
```

Raycast will ask for the OpenAI API key preference the first time the command needs it.

## Editable Files

The main human-editable prompt lives in:

```text
src/lib/prompt/prompt-template.ts
```

Operational defaults and constants live in:

```text
src/lib/app-config.ts
```

If you change the default OpenAI model, update both `src/lib/app-config.ts` and the `model` preference default in `package.json`, because Raycast reads Settings defaults from the manifest.

## Model Selection

Run `Choose OpenAI Model` in Raycast to fetch models available to your OpenAI API key and save the model used by `Improve Text: Five Variants`.

Model resolution order:

1. Model saved by `Choose OpenAI Model`.
2. `OpenAI Model` value from Raycast Settings.
3. Built-in default `gpt-5.4-mini`.

Raycast Settings dropdown preferences are static manifest data, so the dynamic model list lives in this separate command instead of inside Settings.

## Usage

1. Select text in the active app, or copy text to the clipboard.
2. Run `Improve Text: Five Variants` in Raycast.
3. Choose a variant from the left list.
4. Read the full variant in the right detail pane.
5. Check the `Using Model` section at the bottom of the left list if you want to see which OpenAI model was used.
6. Press Enter to copy the selected variant.
7. Press Cmd+Enter to replace selected source text when the source came from a selection.
8. Paste manually wherever you want if you copied instead of replacing.

## Source Text Resolution

The extension resolves source text in this order:

1. Raycast `getSelectedText()`.
2. A layout-independent physical Cmd+C fallback for selected text.
3. Clipboard text.

This means selected text should still work when the current keyboard layout is Russian, English, or changed after selecting the text. If the selected text is exactly the same as the existing clipboard content, the extension may treat it as clipboard text because macOS does not expose whether the copy came from a live selection.

## Limits

The extension validates text after normalization and before calling OpenAI:

- Warning constant: 120,000 characters.
- Hard limit: 300,000 characters.

Texts above the hard limit show a user-facing error instead of being sent to OpenAI.

## Privacy

The extension sends the selected or copied text to OpenAI to generate variants. It does not write source text, generated variants, or your API key to project files.

The OpenAI API key is stored by Raycast as a password preference and is sent only in the `Authorization` header for the OpenAI Responses API request.

## Verification

```bash
npm test
npx tsc --noEmit
npm run lint
npm run build
npm audit --audit-level=moderate
```
