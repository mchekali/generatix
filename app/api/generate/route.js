import { NextResponse } from 'next/server';
import { replicateRun } from '@/utils/replicate';

export async function POST(request) {
  try {
    const { prompt, imageUrl } = await request.json();

    if (!prompt || !imageUrl) {
      return NextResponse.json(
        { error: 'Prompt and Image URL are required' },
        { status: 400 },
      );
    }

    const output = await replicateRun(
      'adirik/interior-design:76604baddc85b1b4616e1c6475eca080da339c8875bd4996705440484a6eac38',
      {
        image: imageUrl,
        prompt: prompt,
        guidance_scale: 10,
        negative_prompt:
          'cluttered, outdated, fragile, boring, dark, cramped, unsafe, sterile, dull, uncomfortable, impractical, uninviting, minimalist, bland, monotonous, complex',
        prompt_strength: 0.65,
        num_inference_steps: 150,
      },
    );

    return NextResponse.json({ output });
  } catch (error) {
    console.error('Error generating image:', error);
    return NextResponse.json(
      { error: 'Failed to generate image' },
      { status: 500 },
    );
  }
}
