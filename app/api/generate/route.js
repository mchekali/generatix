import { NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(request) {
    try {
        const {
            garmentImageBase64,
            humanImageBase64,
            prompt,
            crop,
            force_dc,
            category,
        } = await request.json();

        if (!garmentImageBase64 || !humanImageBase64) {
            return NextResponse.json(
                { error: "Garment Image and Human Image are required" },
                { status: 400 },
            );
        }

        const output = await replicate.run(
            "cuuupid/idm-vton:c871bb9b046607b680449ecbae55fd8c6d945e0a1948644bf2361b3d021d3ff4",
            {
                input: {
                    crop: crop,
                    seed: 30,
                    steps: 20,
                    category: category,
                    force_dc: force_dc,
                    garm_img: garmentImageBase64,
                    human_img: humanImageBase64,
                    mask_only: false,
                    garment_des: prompt,
                }
            }
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