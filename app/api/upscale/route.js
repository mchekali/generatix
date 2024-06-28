import { NextResponse } from 'next/server';
import { replicateRun } from '@/utils/replicate';

export async function POST(request) {
  try {
    const { image } = await request.json();

    if (!image) {
      return NextResponse.json({ error: 'Image is required' }, { status: 400 });
    }

    const output = await replicateRun(
      'philz1337x/clarity-upscaler:029d48aa21712d6769d7a46729c1edf0e4d41919c70b270785f10abb82989ba5',
      {
        seed: 1337,
        image,
        prompt:
          'masterpiece, best quality, highres, <lora:more_details:0.5> <lora:SDXLrender_v2.0:1>',
        dynamic: 6,
        handfix: 'disabled',
        sharpen: 0,
        sd_model: 'epicrealism_naturalSinRC1VAE.safetensors [84d76a0328]', // Ensure this is a valid value
        scheduler: 'DPM++ 3M SDE Karras',
        creativity: 0.35,
        lora_links: '',
        downscaling: false,
        resemblance: 0.6,
        scale_factor: 2,
        tiling_width: 112,
        output_format: 'png',
        tiling_height: 144,
        custom_sd_model: '',
        negative_prompt:
          '(worst quality, low quality, normal quality:2) JuggernautNegative-neg',
        num_inference_steps: 18,
        downscaling_resolution: 768,
      },
    );

    return NextResponse.json({ output });
  } catch (error) {
    console.error('Error upscaling image:', error);
    return NextResponse.json(
      { error: 'Failed to upscale image' },
      { status: 500 },
    );
  }
}
