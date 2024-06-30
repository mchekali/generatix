"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useState, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";

const CreatePrompt = () => {
  const [guidanceScale, setGuidanceScale] = useState(50);
  const [numInferenceSteps, setNumInferenceSteps] = useState(15);
  const [promptStrength, setPromptStrength] = useState(0.8);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [prompt, setPrompt] = useState("");
  // const [negativePrompt, setNegativePrompt] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [upscaledImage, setUpscaledImage] = useState(null);

  const handleGuidanceScaleChange = (event) => {
    setGuidanceScale(event.target.value);
  };

  const handleNumInferenceStepsChange = (event) => {
    setNumInferenceSteps(event.target.value);
  };

  const handlePromptStrengthChange = (event) => {
    setPromptStrength(event.target.value);
  };

  const handlePromptChange = (event) => {
    setPrompt(event.target.value);
  };

  // const handleNegativePromptChange = (event) => {
  //   setNegativePrompt(event.target.value);
  // };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSelectedImage(url);

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        const base64data = reader.result;
        setImageUrl(base64data);
      };
    }
  };

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const url = URL.createObjectURL(file);
      setSelectedImage(url);

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        const base64data = reader.result;
        setImageUrl(base64data);
        console.log(imageUrl);
      };
    }
  }, []);

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setGeneratedImage(null);
  //   setUpscaledImage(null);

  //   if (imageUrl) {
  //     // Convert base64 to Blob
  //     const base64Response = await fetch(imageUrl);
  //     const blob = await base64Response.blob();
  //     const file = new File([blob], `image-${Date.now()}.png`, {
  //       type: blob.type,
  //     });

  //     // Create FormData object and append file
  //     const formData = new FormData();
  //     formData.append("file", file);

  //     // Upload image to your VPS server
  //     const response = await fetch("https://www.remedeasy.com/node/upload", {
  //       method: "POST",
  //       body: formData,
  //     });

  //     const data = await response.json();
  //     const publicImageUrl = data.imageUrl;
  //     console.log("publicImageUrl: ", publicImageUrl);

  //     // Send public URL to your Replicate endpoint
  //     const generatedResponse = await fetch("/api/generate", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         guidanceScale,
  //         numInferenceSteps,
  //         promptStrength,
  //         prompt,
  //         imageUrl: publicImageUrl,
  //       }),
  //     });
  //     const generatedData = await generatedResponse.json();
  //     setGeneratedImage(generatedData.output);
  //     console.log("Replicate API response:", generatedData.output);

  //     // Call API to upscale image
  //     // const upscaledResponse = await fetch("/api/upscale", {
  //     //   method: "POST",
  //     //   headers: {
  //     //     "Content-Type": "application/json",
  //     //   },
  //     //   body: JSON.stringify({ image: generatedData.output }),
  //     // });
  //     // console.log("generatedData.output = ", generatedData.output);
  //     // const upscaledData = await upscaledResponse.json();
  //     // setUpscaledImage(upscaledData.output);

  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setGeneratedImage(null);
    setUpscaledImage(null);

    if (imageUrl) {
      try {
        // Convert base64 to Blob
        const base64Response = await fetch(imageUrl);
        const blob = await base64Response.blob();
        const file = new File([blob], `image-${Date.now()}.png`, {
          type: blob.type,
        });

        // Create FormData object and append file
        const formData = new FormData();
        formData.append("file", file);

        // Upload image to your VPS server
        const response = await fetch("https://www.remedeasy.com/node/upload", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        const publicImageUrl = data.imageUrl;
        console.log("publicImageUrl: ", publicImageUrl);

        // Send public URL to your Replicate endpoint
        const generatedResponse = await fetch("/api/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            guidanceScale: parseFloat(guidanceScale), // Convert to number
            numInferenceSteps: parseInt(numInferenceSteps, 10), // Convert to integer
            promptStrength: parseFloat(promptStrength), // Convert to number
            prompt,
            imageUrl: publicImageUrl,
          }),
        });

        if (!generatedResponse.ok) {
          throw new Error("Error generating image");
        }

        const generatedData = await generatedResponse.json();
        setGeneratedImage(generatedData.output);
        console.log("Replicate API response:", generatedData.output);

        // Call API to upscale image
        // const upscaledResponse = await fetch("/api/upscale", {
        //   method: "POST",
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        //   body: JSON.stringify({ image: generatedData.output }),
        // });
        // console.log("generatedData.output = ", generatedData.output);
        // const upscaledData = await upscaledResponse.json();
        // setUpscaledImage(upscaledData.output);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <section className="w-full max-w-full flex flex-col bg-gray-300">
      {/* Main content */}
      <div className=" mx-2 px-4 py-6 ">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
          {/* First column (1/5) */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>
              <h2 className="text-lg font-semibold mb-2">Parameters</h2>
              <div className="flex justify-center items-center py-1 rounded-lg bginput mb-4">
                <img
                  alt="tokens"
                  className="w-8 mr-2"
                  src="/assets/icons/credit.png"
                />
                0
              </div>

              {/* dropzone-file */}
              <div>
                <label className="flex items-center">
                  <span className="font-satoshi text-base text-black mr-2">
                    Image <span className="text-red-500">*</span>
                  </span>
                </label>
                <div
                  className={`flex flex-col items-center justify-center w-full h-32 border bginput rounded-lg cursor-pointer text-black mt-1 mb-4 ${
                    dragActive ? "border-dashed border-blue-600" : ""
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <label
                    htmlFor="dropzone-file"
                    className="w-full h-full flex flex-col items-center justify-center pt-5 pb-6 cursor-pointer"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <p className="mb-2 text-sm">
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs">
                        (Format PNG or JPG, Max size: 2 MB)
                      </p>
                    </div>
                  </label>
                  <input
                    type="file"
                    id="dropzone-file"
                    className="hidden"
                    onChange={handleImageUpload}
                    accept="image/png, image/jpeg"
                  />
                </div>
              </div>

              {/* Prompt */}
              <div className="mb-4">
                <label>
                  <span className="font-satoshi text-base text-black ">
                    Prompt <span className="text-red-500">*</span>
                  </span>

                  <textarea
                    value={prompt}
                    onChange={handlePromptChange}
                    placeholder="Write your prompt here"
                    required
                    className="form_textarea bginput "
                  />
                </label>
              </div>

              {/* Guidance Scale */}
              <div className="mb-4">
                <label className="flex items-center">
                  <span className="font-satoshi text-base text-black mr-2">
                    Guidance scale
                  </span>
                  <div className="relative group flex items-center">
                    <FontAwesomeIcon
                      icon={faInfoCircle}
                      className="w-4 h-4 text-gray-500 cursor-pointer"
                    />
                    <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 w-48 p-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 transition-opacity duration-200 pointer-events-none group-hover:opacity-100">
                      This is a setting that tells the AI how strongly to follow
                      your text prompt. A higher number means the AI will stick
                      more closely to what you described in your prompt. <br />
                      Default value: 7.5 <br />
                      Explanation: This is a balanced value that ensures the AI
                      follows the text prompt well without being too rigid or
                      too loose.
                    </div>
                  </div>
                </label>
                <div className="flex items-center mt-2">
                  <input
                    className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer"
                    type="range"
                    min="1"
                    max="50"
                    step="0.01"
                    value={guidanceScale}
                    onChange={handleGuidanceScaleChange}
                  />
                  <input
                    className="w-16 ml-2 p-1 bg-gray-200 rounded-lg border border-gray-400"
                    type="number"
                    min="1"
                    max="50"
                    step="0.01"
                    value={guidanceScale}
                    onChange={handleGuidanceScaleChange}
                  />
                </div>
              </div>

              {/* Num Inference Steps */}
              <div className="mb-4">
                <label className="flex items-center">
                  <span className="font-satoshi text-base text-black mr-2">
                    Num inference steps
                  </span>
                  <div className="relative group flex items-center">
                    <FontAwesomeIcon
                      icon={faInfoCircle}
                      className="w-4 h-4 text-gray-500 cursor-pointer"
                    />
                    <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 w-48 p-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 transition-opacity duration-200 pointer-events-none group-hover:opacity-100">
                      This is like the number of steps the AI takes to refine
                      the design. More steps can lead to a more detailed and
                      polished result, but it might take longer to process.{" "}
                      <br />
                      Default value: 7.5 <br />
                      Explanation: This is a balanced value that ensures the AI
                      follows the text prompt well without being too rigid or
                      too loose.
                    </div>
                  </div>
                </label>
                <div className="flex items-center mt-2">
                  <input
                    className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer"
                    type="range"
                    min="1"
                    max="500"
                    step="1"
                    value={numInferenceSteps}
                    onChange={handleNumInferenceStepsChange}
                  />
                  <input
                    className="w-16 ml-2 p-1 bg-gray-200 rounded-lg border border-gray-400"
                    type="number"
                    min="1"
                    max="500"
                    step="1"
                    value={numInferenceSteps}
                    onChange={handleNumInferenceStepsChange}
                  />
                </div>
              </div>

              {/* Prompt Strength */}
              <div className="mb-4">
                <label className="flex items-center">
                  <span className="font-satoshi text-base text-black mr-2">
                    Prompt strength
                  </span>
                  <div className="relative group flex items-center">
                    <FontAwesomeIcon
                      icon={faInfoCircle}
                      className="w-4 h-4 text-gray-500 cursor-pointer"
                    />
                    <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 w-48 p-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 transition-opacity duration-200 pointer-events-none group-hover:opacity-100">
                      This controls how much of the original image gets changed
                      when you use your prompt. If you set it to 1.0, the AI
                      will completely change the image according to your prompt.
                      Lower values will keep more of the original image intact.{" "}
                      <br />
                      Default value: 7.5 <br />
                      Explanation: This is a balanced value that ensures the AI
                      follows the text prompt well without being too rigid or
                      too loose.
                    </div>
                  </div>
                </label>
                <div className="flex items-center mt-2">
                  <input
                    className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer"
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={promptStrength}
                    onChange={handlePromptStrengthChange}
                  />
                  <input
                    className="w-16 ml-2 p-1 bg-gray-200 rounded-lg border border-gray-400"
                    type="number"
                    min="0"
                    max="1"
                    step="0.01"
                    value={promptStrength}
                    onChange={handlePromptStrengthChange}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="mt-4 mx-auto bg-blue-500 text-white py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center"
                disabled={loading}
              >
                <img
                  src="/assets/icons/wand.png"
                  alt=""
                  width={28}
                  height={28}
                  className="mr-2"
                />
                {loading ? "Uploading..." : "Generate"}
              </button>
            </form>
          </div>

          {/* Second column (4/5) */}
          <div className="lg:col-span-4 flex flex-col">
            <h2 className="text-lg font-semibold mb-2">Input</h2>

            <div className="rounded-xl shadow-md relative">
              {selectedImage && (
                <>
                  <Image
                    src={selectedImage}
                    alt="Input image"
                    height={0}
                    width={0}
                    sizes="100vw"
                    className="w-auto rounded-t-xl"
                  />
                  <span className="absolute top-2 left-2 bg-black text-white px-2 py-1 rounded-md text-sm">
                    BEFORE
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Third column (4/5) */}
          <div className="lg:col-span-4 flex flex-col">
            <h2 className="text-lg font-semibold mb-2">Output</h2>
            {generatedImage && (
              <div className="rounded-xl shadow-md relative">
                <img
                  src={generatedImage}
                  alt="Output image"
                  className="w-full h-auto rounded-t-xl"
                />
                <span className="absolute top-2 left-2 bg-black text-white px-2 py-1 rounded-md text-sm">
                  AFTER
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreatePrompt;
