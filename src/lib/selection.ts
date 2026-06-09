import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const COPY_SELECTED_TEXT_SCRIPT = [
  'tell application "System Events"',
  "  key code 8 using {command down}",
  "end tell",
].join("\n");

type CopySelectedTextDependencies = {
  readClipboardText: () => Promise<string | undefined>;
  runAppleScript?: (script: string) => Promise<void>;
  wait?: (milliseconds: number) => Promise<void>;
};

export async function copySelectedTextWithKeyboardShortcut({
  readClipboardText,
  runAppleScript = runAppleScriptWithOsascript,
  wait = waitForClipboard,
}: CopySelectedTextDependencies): Promise<string> {
  const previousClipboardText = await readClipboardText();

  await runAppleScript(COPY_SELECTED_TEXT_SCRIPT);
  await wait(140);

  const copiedText = await readClipboardText();
  if (
    copiedText === undefined ||
    copiedText.length === 0 ||
    copiedText === previousClipboardText
  ) {
    return "";
  }

  return copiedText;
}

async function runAppleScriptWithOsascript(script: string): Promise<void> {
  await execFileAsync("/usr/bin/osascript", ["-e", script]);
}

async function waitForClipboard(milliseconds: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, milliseconds));
}
