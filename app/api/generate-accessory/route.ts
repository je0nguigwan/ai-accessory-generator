import { NextResponse } from "next/server";
import OpenAI from "openai";

const model = process.env.OPENAI_IMAGE_MODEL ?? "gpt-image-1";

export async function POST(request: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OpenAI API key is not configured." },
      { status: 500 }
    );
  }

  let prompt = "";
  try {
    const body = await request.json();
    prompt = (body?.prompt as string)?.trim();
  } catch {
    return NextResponse.json(
      { error: "Invalid request payload." },
      { status: 400 }
    );
  }

  if (!prompt) {
    return NextResponse.json(
      { error: "Prompt is required." },
      { status: 400 }
    );
  }

  try {
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await client.images.generate({
      model,
      prompt,
      size: "1024x1024",
    });

    const imageUrl = response.data?.[0]?.url;
    const imageBase64 = response.data?.[0]?.b64_json;

    if (!imageUrl && !imageBase64) {
      throw new Error("Image generation returned no results.");
    }

    return NextResponse.json({
      imageUrl: imageUrl ?? `data:image/png;base64,${imageBase64}`,
    });
  } catch (error) {
    console.error("Accessory generation failed:", error);
    const message =
      error instanceof Error ? error.message : "Failed to generate image.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
