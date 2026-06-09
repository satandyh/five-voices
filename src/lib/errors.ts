export type UserErrorCode =
  | "empty_input"
  | "input_too_large"
  | "missing_api_key"
  | "unauthorized"
  | "network"
  | "invalid_json"
  | "invalid_response"
  | "unknown";

export class UserFacingError extends Error {
  readonly code: UserErrorCode;
  readonly title: string;

  constructor(code: UserErrorCode, title: string, message: string) {
    super(message);
    this.name = "UserFacingError";
    this.code = code;
    this.title = title;
  }
}

export class EmptyInputError extends UserFacingError {
  constructor() {
    super(
      "empty_input",
      "Нет текста",
      "Выдели текст в активном приложении или скопируй его в буфер обмена, затем запусти команду снова.",
    );
    this.name = "EmptyInputError";
  }
}

export class InputTooLargeError extends UserFacingError {
  constructor(actualCharacters: number, limitCharacters: number) {
    super(
      "input_too_large",
      "Слишком много текста",
      `Сейчас в исходном тексте ${actualCharacters.toLocaleString("ru-RU")} символов. Для стабильной работы расширения максимум ${limitCharacters.toLocaleString("ru-RU")} символов. Раздели текст на несколько частей и попробуй снова.`,
    );
    this.name = "InputTooLargeError";
  }
}

export function invalidJsonError(): UserFacingError {
  return new UserFacingError(
    "invalid_json",
    "Ответ OpenAI не похож на JSON",
    "Модель вернула ответ в неожиданном формате. Попробуй сгенерировать варианты ещё раз.",
  );
}

export function invalidResponseError(): UserFacingError {
  return new UserFacingError(
    "invalid_response",
    "Ответ OpenAI неполный",
    "Модель не вернула ровно пять вариантов в нужном порядке. Попробуй сгенерировать варианты ещё раз.",
  );
}

export function missingApiKeyError(): UserFacingError {
  return new UserFacingError(
    "missing_api_key",
    "Нужен OpenAI API key",
    "Добавь OpenAI API key в настройках расширения Raycast.",
  );
}

export function unauthorizedError(): UserFacingError {
  return new UserFacingError(
    "unauthorized",
    "OpenAI API key не подошёл",
    "Проверь ключ в настройках расширения Raycast. Он не будет показан или записан в логи.",
  );
}

export function networkError(): UserFacingError {
  return new UserFacingError(
    "network",
    "Не удалось связаться с OpenAI",
    "Проверь интернет-соединение и попробуй ещё раз.",
  );
}

export function unknownApiError(): UserFacingError {
  return new UserFacingError(
    "unknown",
    "OpenAI вернул ошибку",
    "Запрос не удалось выполнить. Попробуй ещё раз позже.",
  );
}
