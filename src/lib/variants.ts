export const VARIANT_IDS = [
  "editor_literary",
  "meaning_first",
  "with_character",
  "smart_stenographer",
  "speech_to_text",
] as const;

export type VariantId = (typeof VARIANT_IDS)[number];

export type VariantDefinition = {
  id: VariantId;
  title: string;
  subtitle: string;
};

export const VARIANT_DEFINITIONS: VariantDefinition[] = [
  {
    id: "editor_literary",
    title: "Редактор-литератор",
    subtitle: "Красиво письменно",
  },
  {
    id: "meaning_first",
    title: "Смысл важнее формы",
    subtitle: "Главное без лишнего",
  },
  {
    id: "with_character",
    title: "С характером",
    subtitle: "Уверенно",
  },
  {
    id: "smart_stenographer",
    title: "Умный стенографист",
    subtitle: "Как для публикации",
  },
  {
    id: "speech_to_text",
    title: "Разговор → текст",
    subtitle: "Устное в письменное",
  },
];

export type VariantResult = {
  id: VariantId;
  text: string;
};
