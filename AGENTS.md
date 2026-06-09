# Project Notes

This repository contains a Raycast extension built with Codex. The extension improves selected or copied text by generating five editing variants through the OpenAI API.

## Working Guidelines

- Keep behavior conservative: the extension reads selected text or clipboard text and can copy or replace user-selected content.
- Do not store source text, generated variants, or OpenAI API keys in project files.
- Preserve the Raycast command metadata in `package.json`.
- Keep the main prompt easy to edit in `src/lib/prompt/prompt-template.ts`.
- Keep operational defaults and constants easy to edit in `src/lib/app-config.ts`.
- Prefer small, reviewable changes with tests for behavior that touches input handling, model selection, OpenAI requests, parsing, formatting, or clipboard actions.

## Verification

Run these checks after editing:

```bash
npm test
npx tsc --noEmit
npm run lint
npm run build
npm audit --audit-level=moderate
```
