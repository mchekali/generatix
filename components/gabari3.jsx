"use client";

import Image from "next/image";
import { useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";

const CreatePrompt = () => {
  const [guidanceScale, setGuidanceScale] = useState(50);
  const [numInferenceSteps, setNumInferenceSteps] = useState(15);
  const [promptStrength, setPromptStrength] = useState(0.8);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const [imageUrl, setImageUrl] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleGuidanceScaleChange = (event) => {
    setGuidanceScale(event.target.value);
  };

  const handleNumInferenceStepsChange = (event) => {
    setNumInferenceSteps(event.target.value);
  };

  const handlePromptStrengthChange = (event) => {
    setPromptStrength(event.target.value);
  };

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
      };
    }
  }, []);

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   if (imageUrl) {
  //     try {
  //       // Upload image to your API endpoint
  //       const filename = `image-${Date.now()}.png`; // or use the appropriate file extension
  //       const response = await fetch("/api/upload", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({ file: imageUrl, filename }),
  //       });

  //       const data = await response.json();
  //       const publicImageUrl = data.imageUrl;

  //       // Send public URL to your Replicate endpoint
  //       const replicateResponse = await fetch("/api/generate", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           imageUrl: publicImageUrl,
  //         }),
  //       });

  //       const replicateData = await replicateResponse.json();
  //       console.log("Replicate API response:", replicateData);
  //     } catch (error) {
  //       console.error("Error sending image to API:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

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
        const response = await fetch("https://www.remedeasy.com/node/", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        const publicImageUrl = data.imageUrl;

        // Send public URL to your Replicate endpoint
        const replicateResponse = await fetch("/api/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            imageUrl: publicImageUrl,
          }),
        });

        const replicateData = await replicateResponse.json();
        console.log("Replicate API response:", replicateData);
      } catch (error) {
        console.error("Error sending image to API:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <section className="w-full max-w-full flex flex-col bg-gray-300">
      <div className="mx-2 px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
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

              <button
                type="submit"
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg"
                disabled={loading}
              >
                {loading ? "Uploading..." : "Submit"}
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
            <div className="rounded-xl shadow-md relative">
              <Image
                src="/assets/images/img2.png"
                alt="Output image"
                height={0}
                width={0}
                sizes="100vw"
                className="w-full h-auto rounded-t-xl"
                style={{ objectFit: "cover" }}
              />
              <span className="absolute top-2 left-2 bg-black text-white px-2 py-1 rounded-md text-sm">
                AFTER
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  // return (
  //   <section className="w-full max-w-full flex flex-col bg-gray-300">
  //     {/* Main content */}
  //     <div className=" mx-2 px-4 py-6 ">
  //       <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
  //         {/* First column (1/5) */}
  //         <div className="lg:col-span-2">
  //           <form onSubmit={handleSubmit}>
  //             <h2 className="text-lg font-semibold mb-2">Parameters</h2>
  //             <div className="flex justify-center items-center py-1 rounded-lg bginput mb-4">
  //               <img
  //                 alt="tokens"
  //                 className="w-8 mr-2"
  //                 src="/assets/icons/credit.png"
  //               />
  //               0
  //             </div>

  //             {/* dropzone-file */}
  //             <div>
  //               <label className="flex items-center">
  //                 <span className="font-satoshi text-base text-black mr-2">
  //                   Image <span className="text-red-500">*</span>
  //                 </span>
  //               </label>
  //               <div className="flex flex-col items-center justify-center w-full h-32 border bginput rounded-lg cursor-pointer text-black mt-1 mb-4">
  //                 <label
  //                   htmlFor="dropzone-file"
  //                   className="w-full h-full flex flex-col items-center justify-center pt-5 pb-6 cursor-pointer"
  //                 >
  //                   <div className="flex flex-col items-center justify-center">
  //                     <svg
  //                       className="w-8 h-4 mb-4 text-black"
  //                       aria-hidden="true"
  //                       xmlns="http://www.w3.org/2000/svg"
  //                       fill="none"
  //                       viewBox="0 0 20 16"
  //                     >
  //                       <path
  //                         stroke="currentColor"
  //                         strokeLinecap="round"
  //                         strokeLinejoin="round"
  //                         strokeWidth="2"
  //                         d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
  //                       ></path>
  //                     </svg>
  //                     <p className="mb-2 text-sm">
  //                       <span className="font-semibold">Click to upload</span>{" "}
  //                       or drag and drop Image
  //                     </p>
  //                     <p className="text-xs">
  //                       (Format PNG or JPG, Max size: 2 MB)
  //                     </p>
  //                   </div>
  //                 </label>
  //                 <input
  //                   type="file"
  //                   id="dropzone-file"
  //                   className="hidden"
  //                   onChange={handleImageUpload}
  //                   accept="image/png, image/jpeg"
  //                 />
  //               </div>
  //             </div>

  //             {/* Prompt */}
  //             <div className="mb-4">
  //               <label>
  //                 <span className="font-satoshi text-base text-black ">
  //                   Prompt <span className="text-red-500">*</span>
  //                 </span>

  //                 <textarea
  //                   value=""
  //                   placeholder="Write your prompt here"
  //                   required
  //                   className="form_textarea bginput "
  //                 />
  //               </label>
  //             </div>

  //             {/* Negative Prompt */}
  //             <div className="mb-4">
  //               <label>
  //                 <span className="font-satoshi text-base text-black ">
  //                   Negative Prompt (optional)
  //                 </span>

  //                 <textarea
  //                   value=""
  //                   placeholder="Write your negative prompt here"
  //                   required
  //                   className="form_textarea bginput "
  //                 />
  //               </label>
  //             </div>

  //             <div>
  //               {/* Guidance Scale */}
  //               <div className="mb-4">
  //                 <label className="flex items-center">
  //                   <span className="font-satoshi text-base text-black mr-2">
  //                     Guidance scale
  //                   </span>
  //                   <div className="relative group flex items-center">
  //                     <FontAwesomeIcon
  //                       icon={faInfoCircle}
  //                       className="w-4 h-4 text-black cursor-pointer"
  //                     />
  //                     <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 w-48 p-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 transition-opacity duration-200 pointer-events-none group-hover:opacity-100">
  //                       This is a setting that tells the AI how strongly to
  //                       follow your text prompt. A higher number means the AI
  //                       will stick more closely to what you described in your
  //                       prompt. <br />
  //                       Default value: 7.5 <br />
  //                       Explanation: This is a balanced value that ensures the
  //                       AI follows the text prompt well without being too rigid
  //                       or too loose.
  //                     </div>
  //                   </div>
  //                 </label>
  //                 <div className="flex items-center mt-2 space-x-2">
  //                   <input
  //                     className="flex-grow h-2 bg-gray-200 rounded-lg cursor-pointer"
  //                     type="range"
  //                     min="1"
  //                     max="50"
  //                     step="0.01"
  //                     value={guidanceScale}
  //                     onChange={handleGuidanceScaleChange}
  //                     style={{ appearance: "none" }}
  //                   />
  //                   <input
  //                     className="w-20 p-1 bg-white rounded-lg border border-gray-400"
  //                     type="number"
  //                     min="1"
  //                     max="50"
  //                     step="0.01"
  //                     value={guidanceScale}
  //                     onChange={handleGuidanceScaleChange}
  //                   />
  //                 </div>
  //               </div>

  //               {/* Num Inference Steps */}
  //               <div className="mb-4">
  //                 <label className="flex items-center">
  //                   <span className="font-satoshi text-base text-black mr-2">
  //                     Num inference steps
  //                   </span>
  //                   <div className="relative group flex items-center">
  //                     <FontAwesomeIcon
  //                       icon={faInfoCircle}
  //                       className="w-4 h-4 text-black cursor-pointer"
  //                     />
  //                     <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 w-48 p-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 transition-opacity duration-200 pointer-events-none group-hover:opacity-100">
  //                       This is like the number of steps the AI takes to refine
  //                       the design. More steps can lead to a more detailed and
  //                       polished result, but it might take longer to process.{" "}
  //                       <br />
  //                       Default value: 7.5 <br />
  //                       Explanation: This is a balanced value that ensures the
  //                       AI follows the text prompt well without being too rigid
  //                       or too loose.
  //                     </div>
  //                   </div>
  //                 </label>
  //                 <div className="flex items-center mt-2 space-x-2">
  //                   <input
  //                     className="flex-grow h-2 bg-gray-200 rounded-lg cursor-pointer"
  //                     type="range"
  //                     min="1"
  //                     max="500"
  //                     step="1"
  //                     value={numInferenceSteps}
  //                     onChange={handleNumInferenceStepsChange}
  //                     style={{ appearance: "none" }}
  //                   />
  //                   <input
  //                     className="w-20 p-1 bg-white rounded-lg border border-gray-400"
  //                     type="number"
  //                     min="1"
  //                     max="500"
  //                     step="1"
  //                     value={numInferenceSteps}
  //                     onChange={handleNumInferenceStepsChange}
  //                   />
  //                 </div>
  //               </div>

  //               {/* Prompt Strength */}
  //               <div className="mb-4">
  //                 <label className="flex items-center">
  //                   <span className="font-satoshi text-base text-black mr-2">
  //                     Prompt strength
  //                   </span>
  //                   <div className="relative group flex items-center">
  //                     <FontAwesomeIcon
  //                       icon={faInfoCircle}
  //                       className="w-4 h-4 text-black cursor-pointer"
  //                     />
  //                     <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 w-48 p-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 transition-opacity duration-200 pointer-events-none group-hover:opacity-100">
  //                       This controls how much of the original image gets
  //                       changed when you use your prompt. If you set it to 1.0,
  //                       the AI will completely change the image according to
  //                       your prompt. Lower values will keep more of the original
  //                       image intact. <br />
  //                       Default value: 7.5 <br />
  //                       Explanation: This is a balanced value that ensures the
  //                       AI follows the text prompt well without being too rigid
  //                       or too loose.
  //                     </div>
  //                   </div>
  //                 </label>
  //                 <div className="flex items-center mt-2 space-x-2">
  //                   <input
  //                     className="flex-grow h-2 bg-gray-200 rounded-lg cursor-pointer"
  //                     type="range"
  //                     min="0"
  //                     max="1"
  //                     step="0.01"
  //                     value={promptStrength}
  //                     onChange={handlePromptStrengthChange}
  //                     style={{ appearance: "none" }}
  //                   />
  //                   <input
  //                     className="w-20 p-1 bg-white rounded-lg border border-gray-400"
  //                     type="number"
  //                     min="0"
  //                     max="1"
  //                     step="0.01"
  //                     value={promptStrength}
  //                     onChange={handlePromptStrengthChange}
  //                   />
  //                 </div>
  //               </div>
  //             </div>

  //             <button
  //               type="submit"
  //               // className="mt-4 mx-auto bg_generate text-white py-2 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center"
  //               className="mt-4 mx-auto bg-sky-500/50 text-white py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center"
  //             >
  //               <img
  //                 src="/assets/icons/wand.png"
  //                 alt=""
  //                 width={28}
  //                 height={28}
  //                 className="mr-2"
  //               />
  //               Generate
  //             </button>
  //           </form>
  //         </div>

  //         {/* Second column (4/5) */}
  //         <div className="lg:col-span-4 flex flex-col">
  //           <h2 className="text-lg font-semibold mb-2">Input</h2>

  //           {/* Input field
  //           <input
  //             type="text"
  //             value=""
  //             readOnly
  //             className="mb-2 p-2 border border-gray-300 rounded-lg"
  //             placeholder="Image URL will appear here"
  //           /> */}

  //           <div className="rounded-xl shadow-md relative">
  //             {selectedImage && (
  //               <>
  //                 <Image
  //                   src={selectedImage}
  //                   alt="Input image"
  //                   height={0}
  //                   width={0}
  //                   sizes="100vw"
  //                   className="w-auto rounded-t-xl"
  //                 />
  //                 <span className="absolute top-2 left-2 bg-black text-white px-2 py-1 rounded-md text-sm">
  //                   BEFORE
  //                 </span>
  //               </>
  //             )}
  //           </div>
  //         </div>

  //         {/* Third column (4/5) */}
  //         <div className="lg:col-span-4 flex flex-col">
  //           <h2 className="text-lg font-semibold mb-2">Output</h2>
  //           <div className="rounded-xl shadow-md relative">
  //             <Image
  //               src="/assets/images/img2.png"
  //               alt="Output image"
  //               height={0}
  //               width={0}
  //               sizes="100vw"
  //               className="w-full h-auto rounded-t-xl"
  //               style={{ objectFit: "cover" }}
  //             />
  //             <span className="absolute top-2 left-2 bg-black text-white px-2 py-1 rounded-md text-sm">
  //               AFTER
  //             </span>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   </section>
  // );
};

export default CreatePrompt;
