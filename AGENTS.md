# Project Notes

This is the `satandyh/five-voices` GitHub repository: a Raycast extension built with Codex for generating five improved text variants through the OpenAI API.

## Keep In Mind

- Do not store source text, generated variants, OpenAI API keys, `.env` files, or local Raycast artifacts in git.
- Keep the prompt in `src/lib/prompt/prompt-template.ts`.
- Keep editable defaults in `src/lib/app-config.ts`.
- Preserve Raycast command settings in `package.json`.
- Prefer small changes with tests when touching input handling, model selection, OpenAI calls, parsing, formatting, or clipboard actions.

## Verify

```bash
npm test
npx tsc --noEmit
npm run lint
npm run build
npm audit --audit-level=moderate
```
