export const maxDuration = 60;

import { NextResponse } from "next/server";
// import { replicateRun } from "@/utils/replicate";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(request) {
  try {
    const {
      guidanceScale,
      numInferenceSteps,
      promptStrength,
      prompt,
      imageUrl,
    } = await request.json();

    if (!prompt || !imageUrl) {
      return NextResponse.json(
        { error: "Prompt and Image URL are required" },
        { status: 400 },
      );
    }

    const output = await replicate.run(
      "adirik/interior-design:76604baddc85b1b4616e1c6475eca080da339c8875bd4996705440484a6eac38",
      {
        input: {
          image: imageUrl,
          prompt: prompt,
          guidance_scale: guidanceScale,
          negative_prompt:
            "lowres, watermark, banner, logo, watermark, contactinfo, text, deformed, blurry, blur, out of focus, out of frame, surreal, extra, ugly, upholstered walls, fabric walls, plush walls, mirror, mirrored, functional, realistic",
          prompt_strength: promptStrength,
          num_inference_steps: numInferenceSteps,
        },
      },
    );
    console.log(output);

    return NextResponse.json({ output });
  } catch (error) {
    console.error("Error generating image:", error);
    return NextResponse.json(
      { error: "Failed to generate image" },
      { status: 500 },
    );
  }
}
