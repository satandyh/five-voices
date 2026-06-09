import { describe, expect, it, vi } from "vitest";

import { UserFacingError } from "./errors";
import { generateVariants, listOpenAIModels } from "./openai";
import { VARIANT_IDS } from "./variants";

describe("generateVariants", () => {
  it("calls Responses API without logging source text or key", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        output_text: JSON.stringify({
          variants: [
            { id: "editor_literary", text: "A" },
            { id: "meaning_first", text: "B" },
            { id: "with_character", text: "C" },
            { id: "smart_stenographer", text: "D" },
            { id: "speech_to_text", text: "E" },
          ],
        }),
      }),
    });

    const variants = await generateVariants({
      apiKey: "test-api-key",
      model: "gpt-5.4-mini",
      sourceText: "сырой текст",
      fetchImpl: fetchMock,
    });

    expect(variants).toHaveLength(5);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.openai.com/v1/responses",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: "Bearer test-api-key",
          "Content-Type": "application/json",
        }),
      }),
    );
    const [, request] = fetchMock.mock.calls[0] as [string, RequestInit];
    const body = JSON.parse(request.body as string) as {
      text: {
        format: {
          type: string;
          name: string;
          strict: boolean;
          schema: {
            properties: {
              variants: {
                items: { properties: { id: { enum: string[] } } };
              };
            };
          };
        };
      };
    };
    expect(body.text.format).toMatchObject({
      type: "json_schema",
      name: "five_text_variants",
      strict: true,
    });
    expect(
      body.text.format.schema.properties.variants.items.properties.id.enum,
    ).toEqual(VARIANT_IDS);
  });

  it("maps 401 to unauthorized", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      text: async () => "bad key",
    });

    await expect(
      generateVariants({
        apiKey: "test-api-key",
        model: "gpt-5.4-mini",
        sourceText: "сырой текст",
        fetchImpl: fetchMock,
      }),
    ).rejects.toMatchObject({ code: "unauthorized" });
  });

  it("extracts JSON from raw Responses API output items", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        output: [
          {
            type: "message",
            content: [
              {
                type: "output_text",
                text: JSON.stringify({
                  variants: [
                    { id: "editor_literary", text: "A" },
                    { id: "meaning_first", text: "B" },
                    { id: "with_character", text: "C" },
                    { id: "smart_stenographer", text: "D" },
                    { id: "speech_to_text", text: "E" },
                  ],
                }),
              },
            ],
          },
        ],
      }),
    });

    const variants = await generateVariants({
      apiKey: "test-api-key",
      model: "gpt-5.4-mini",
      sourceText: "сырой текст",
      fetchImpl: fetchMock,
    });

    expect(variants.map((variant) => variant.text)).toEqual([
      "A",
      "B",
      "C",
      "D",
      "E",
    ]);
  });

  it("extracts JSON from output_text when the helper is present", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        output_text: JSON.stringify({
          variants: [
            { id: "editor_literary", text: "A" },
            { id: "meaning_first", text: "B" },
            { id: "with_character", text: "C" },
            { id: "smart_stenographer", text: "D" },
            { id: "speech_to_text", text: "E" },
          ],
        }),
      }),
    });

    const variants = await generateVariants({
      apiKey: "test-api-key",
      model: "gpt-5.4-mini",
      sourceText: "сырой текст",
      fetchImpl: fetchMock,
    });

    expect(variants.map((variant) => variant.text)).toEqual([
      "A",
      "B",
      "C",
      "D",
      "E",
    ]);
  });

  it("maps thrown fetch errors to network", async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error("offline"));

    await expect(
      generateVariants({
        apiKey: "test-api-key",
        model: "gpt-5.4-mini",
        sourceText: "сырой текст",
        fetchImpl: fetchMock,
      }),
    ).rejects.toMatchObject({ code: "network" });
  });

  it("rejects empty API key before calling fetch", async () => {
    const fetchMock = vi.fn();

    await expect(
      generateVariants({
        apiKey: "   ",
        model: "gpt-5.4-mini",
        sourceText: "сырой текст",
        fetchImpl: fetchMock,
      }),
    ).rejects.toBeInstanceOf(UserFacingError);

    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe("listOpenAIModels", () => {
  it("returns sorted model ids from the OpenAI Models API", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        object: "list",
        data: [
          { id: "z-model", object: "model" },
          { id: "gpt-5.4-mini", object: "model" },
        ],
      }),
    });

    const models = await listOpenAIModels({
      apiKey: "test-api-key",
      fetchImpl: fetchMock,
    });

    expect(models).toEqual(["gpt-5.4-mini", "z-model"]);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.openai.com/v1/models",
      expect.objectContaining({
        method: "GET",
        headers: expect.objectContaining({
          Authorization: "Bearer test-api-key",
        }),
      }),
    );
  });

  it("deduplicates and ignores invalid model entries", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        data: [
          { id: "gpt-5.4-mini" },
          { id: "gpt-5.4-mini" },
          { id: "" },
          { not_id: "bad" },
        ],
      }),
    });

    await expect(
      listOpenAIModels({ apiKey: "test-api-key", fetchImpl: fetchMock }),
    ).resolves.toEqual(["gpt-5.4-mini"]);
  });

  it("rejects empty API key before calling fetch", async () => {
    const fetchMock = vi.fn();

    await expect(
      listOpenAIModels({ apiKey: " ", fetchImpl: fetchMock }),
    ).rejects.toMatchObject({ code: "missing_api_key" });

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("maps thrown fetch errors to network", async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error("offline"));

    await expect(
      listOpenAIModels({ apiKey: "test-api-key", fetchImpl: fetchMock }),
    ).rejects.toMatchObject({ code: "network" });
  });

  it("maps 401 to unauthorized", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
    });

    await expect(
      listOpenAIModels({ apiKey: "test-api-key", fetchImpl: fetchMock }),
    ).rejects.toMatchObject({ code: "unauthorized" });
  });
});
