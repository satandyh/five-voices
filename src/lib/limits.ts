import { InputTooLargeError } from "./errors";
import { HARD_INPUT_CHARACTER_LIMIT } from "./app-config";

export {
  HARD_INPUT_CHARACTER_LIMIT,
  WARNING_INPUT_CHARACTER_LIMIT,
} from "./app-config";

export function validateInputSize(text: string): void {
  if (text.length > HARD_INPUT_CHARACTER_LIMIT) {
    throw new InputTooLargeError(text.length, HARD_INPUT_CHARACTER_LIMIT);
  }
}
