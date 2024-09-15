"use client";

import Image from "next/image";
import { useState, useCallback, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import "react-tabs/style/react-tabs.css"; // Import the CSS for react-tabs
import { getBase64 } from "../../utils/getBase64";
import Lottie from "react-lottie";
import animationData from "../../public/assets/animation/loading.json";

const CreatePrompt = () => {
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [controller, setController] = useState(null); // For handling cancellation

  const [selectedGarmentImage, setSelectedGarmentImage] = useState(null);
  const [garmentImageUrl, setGarmentImageUrl] = useState(null);
  const [selectedHumanImage, setSelectedHumanImage] = useState(null);
  const [humanImageUrl, setHumanImageUrl] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [category, setCategory] = useState("upper_body");
  const [dragActive, setDragActive] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);

  const [elapsedTime, setElapsedTime] = useState(0);

  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB

  const startTimeRef = useRef(null);

  const handlePromptChange = (event) => {
    setPrompt(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
    console.log("Category:", event.target.value);
  };

  const handleImageUpload = async (event, setImage, setImageUrl) => {
    const file = event.target.files[0];
    if (file && file.size > MAX_FILE_SIZE) {
      alert("File size exceeds the 2 MB limit. Please upload a smaller file.");
      return;
    }

    if (file) {
      const url = URL.createObjectURL(file);
      setImage(url);

      const base64 = await getBase64(file);
      setImageUrl(base64);
    }
  };

  const handleDrop = useCallback((e, setImage, setImageUrl) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file && file.size > MAX_FILE_SIZE) {
        alert(
          "File size exceeds the 2 MB limit. Please upload a smaller file.",
        );
        return;
      }

      const url = URL.createObjectURL(file);
      setImage(url);

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        const base64data = reader.result;
        setImageUrl(base64data);
      };
    }
  }, []);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!garmentImageUrl || !humanImageUrl) {
      console.log("Both images are required");
      return;
    }
    setLoading(true);
    setGeneratedImage(null);
    startTimeRef.current = Date.now(); // Set the start time using ref

    const abortController = new AbortController();
    setController(abortController);

    try {
      setGenerating(true);

      const crop = await checkImageAspectRatio(humanImageUrl);
      const force_dc = checkForceDc(category);

      console.log("Prompt:", prompt);
      console.log("Crop:", crop);
      console.log("Force DC:", force_dc);
      console.log("Category:", category);

      const generatedResponse = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          garmentImageBase64: garmentImageUrl,
          humanImageBase64: humanImageUrl,
          prompt,
          crop,
          force_dc,
          category,
        }),
        signal: abortController.signal,
      });

      if (!generatedResponse.ok) {
        const errorText = await generatedResponse.text();
        throw new Error(`Error generating image: ${errorText}`);
      }

      const generatedData = await generatedResponse.json();
      setGeneratedImage(generatedData.output);
      console.log("Image generated successfully:", generatedData.output);

      // Calculate elapsed time using ref
      setElapsedTime(((Date.now() - startTimeRef.current) / 1000).toFixed(1));
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("Generation canceled");
      } else {
        console.error("Error:", error);
      }
    } finally {
      setController(null);
      setLoading(false);
      setGenerating(false);
    }
  };

  const checkImageAspectRatio = (imageUrl) => {
    return new Promise((resolve) => {
      const img = new window.Image(); // Use native Image object
      img.onload = () => {
        const aspectRatio = img.width / img.height;
        const isNot3to4 = Math.abs(aspectRatio - 3 / 4) > 0.01; // Allow for small rounding errors
        resolve(isNot3to4);
      };
      img.onerror = () => {
        resolve(true); // Assume it's not 3:4 if there's an error loading the image
      };
      img.src = imageUrl;
    });
  };

  const checkForceDc = (category) => {
    return category === "dresses";
  };

  // Cancel function
  const handleCancel = () => {
    if (controller) {
      controller.abort();
    }
  };

  const downloadImage = () => {
    if (!generatedImage) return;

    const link = document.createElement("a");
    link.href = generatedImage;
    link.download = "generated_image.png";
    link.target = "_self"; // Ensure it does not open a new window
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <section className="w-full flex flex-col bg-gray-700 min-h-screen text-gray-100">
      {/* Main content */}
      <div className="w-full py-8 px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* First column (1/3) */}
          <div className="lg:col-span-3 bg-gray-800 p-6 rounded-2xl shadow-lg">
            <form onSubmit={handleSubmit}>
              <h2 className="text-lg font-semibold mb-4">Parameters</h2>
              <div className="flex justify-center items-center rounded-lg bg-gray-700 mb-6">
                <img
                  alt="tokens"
                  className="w-8 mr-2"
                  src="/assets/icons/credit.png"
                />
                0
              </div>
              {/* Garment Image */}
              <div>
                <label className="flex items-center mb-2">
                  <span className="font-satoshi text-sm text-gray-300 mr-2">
                    Garment Image <span className="text-red-500">*</span>
                  </span>
                </label>
                <div
                  className={`flex flex-col items-center justify-center w-full h-20 border bg-gray-700 rounded-lg cursor-pointer text-gray-300 ${
                    dragActive ? "border-dashed border-blue-600" : ""
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={(e) =>
                    handleDrop(e, setSelectedGarmentImage, setGarmentImageUrl)
                  }
                >
                  <label
                    htmlFor="dropzone-garment-file"
                    className="w-full h-full flex flex-col items-center justify-center pt-5 pb-6 cursor-pointer"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <p className="mb-2 text-xs">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs">
                        (Format PNG, WEBP or JPG, Max size: 2 MB)
                      </p>
                    </div>
                  </label>
                  <input
                    type="file"
                    id="dropzone-garment-file"
                    className="hidden"
                    onChange={(e) =>
                      handleImageUpload(
                        e,
                        setSelectedGarmentImage,
                        setGarmentImageUrl,
                      )
                    }
                    accept="image/png, image/jpeg, image/webp"
                  />
                </div>
              </div>
              {/* Category */}
              <div className="mt-6">
                <label className="flex items-center mb-2">
                  <span className="font-satoshi text-sm text-gray-300 mr-2">
                    Category <span className="text-red-500">*</span>
                  </span>
                </label>
                <div className="tw-select">
                  <select
                    id="category"
                    className="w-full border p-2 border-gray-300 bg-gray-700 text-xs text-white rounded-lg"
                    name="category"
                    onChange={handleCategoryChange}
                  >
                    <option value="upper_body">Upper body</option>
                    <option value="lower_body">Lower body</option>
                    <option value="dresses">Dresses</option>
                  </select>
                </div>
              </div>

              {/* Prompt */}
              <div className="mt-6">
                <label>
                  <span className="font-satoshi text-sm text-gray-300">
                    Garment description
                  </span>
                  <textarea
                    value={prompt}
                    onChange={handlePromptChange}
                    placeholder="Description of garment e.g. Red, white and black striped sweater"
                    style={{ fontSize: "12px" }}
                    className="form_textarea bg-gray-700 text-white mt-2 p-2 rounded-lg w-full"
                    rows="2"
                  />
                </label>
              </div>

              {/* Human Image */}
              <div className="mt-6">
                <label className="flex items-center mb-2">
                  <span className="font-satoshi text-sm text-gray-300 mr-2">
                    Person image <span className="text-red-500">*</span>
                  </span>
                </label>
                <div
                  className={`flex flex-col items-center justify-center w-full h-20 border bg-gray-700 rounded-lg cursor-pointer text-gray-300 ${
                    dragActive ? "border-dashed border-blue-600" : ""
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={(e) =>
                    handleDrop(e, setSelectedHumanImage, setHumanImageUrl)
                  }
                >
                  <label
                    htmlFor="dropzone-human-file"
                    className="w-full h-full flex flex-col items-center justify-center pt-5 pb-6 cursor-pointer"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <p className="mb-2 text-xs">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs">
                        (Format PNG, WEBP or JPG, Max size: 2 MB)
                      </p>
                    </div>
                  </label>
                  <input
                    type="file"
                    id="dropzone-human-file"
                    className="hidden"
                    onChange={(e) =>
                      handleImageUpload(
                        e,
                        setSelectedHumanImage,
                        setHumanImageUrl,
                      )
                    }
                    accept="image/png, image/jpeg, image/webp"
                  />
                </div>
              </div>
              <div className="flex items-center justify-center mt-4">
                <button
                  type="submit"
                  className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center w-40"
                  disabled={generating}
                >
                  {loading ? "Processing..." : "Run"}
                </button>

                <button
                  type="button"
                  className="mt-4 ml-4 bg-gray-600 text-white py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-black flex items-center justify-center w-40"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>

          {/* Second column (1/3) */}
          <div className="lg:col-span-4 bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col">
            {selectedGarmentImage && (
              <div className="rounded-xl relative bg-gray-800 p-4 shadow-lg flex justify-center">
                <>
                  <Image
                    src={selectedGarmentImage}
                    alt="Garment image"
                    height={0}
                    width={0}
                    sizes="100vw"
                    className="w-auto rounded-xl"
                  />
                </>
              </div>
            )}
            {selectedHumanImage && (
              <div className="rounded-xl relative bg-gray-800 p-4 shadow-lg mt-4">
                <>
                  <Image
                    src={selectedHumanImage}
                    alt="Human image"
                    height={0}
                    width={0}
                    sizes="100vw"
                    className="w-auto rounded-xl"
                  />
                </>
              </div>
            )}
          </div>

          {/* Third column (1/3) */}
          <div className="lg:col-span-5 bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col">
            {generating ? (
              <div className="flex items-center justify-center w-full h-[100vh] text-blue dark:text-gray-100 dark:bg-gray-950">
                <div className="relative p-4 max-w-sm mx-auto">
                  <Lottie options={defaultOptions} height={200} width={200} />
                  <span className="text-gray-300 text-sm text-center w-full block">
                    Generating your image...
                  </span>
                </div>
              </div>
            ) : (
              generatedImage && (
                <div className="relative rounded-xl bg-gray-800 p-4 shadow-lg">
                  <img
                    src={generatedImage}
                    alt="Output image"
                    className="w-full h-auto rounded-xl"
                  />
                  <span className="text-gray-300 text-xs text-center w-full block mt-2">
                    Generated in {elapsedTime} seconds
                  </span>
                  <button
                    className="absolute bottom-5 right-5 bg-gray-700 text-white p-2 rounded-full flex items-center justify-center"
                    onClick={downloadImage}
                    disabled={!generatedImage}
                    title="Download Image"
                  >
                    <FontAwesomeIcon icon={faDownload} className="w-6 h-6" />
                  </button>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreatePrompt;
