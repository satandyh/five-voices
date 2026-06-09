/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {
  /** OpenAI API Key - Stored locally by Raycast as a password preference. */
  "openaiApiKey": string,
  /** OpenAI Model - Model used for generating variants. */
  "model": string
}

/** Preferences accessible in all the extension's commands */
declare type Preferences = ExtensionPreferences

declare namespace Preferences {
  /** Preferences accessible in the `improve-text-five-variants` command */
  export type ImproveTextFiveVariants = ExtensionPreferences & {}
  /** Preferences accessible in the `choose-openai-model` command */
  export type ChooseOpenaiModel = ExtensionPreferences & {}
}

declare namespace Arguments {
  /** Arguments passed to the `improve-text-five-variants` command */
  export type ImproveTextFiveVariants = {}
  /** Arguments passed to the `choose-openai-model` command */
  export type ChooseOpenaiModel = {}
}

