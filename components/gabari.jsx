import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

const Form = ({ type, post, setPost, submitting, handleSubmit }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <section className="w-full max-w-full flex flex-col bg-gray-200">
      {/* Title frame */}
      <div className="w-full mb-1">
        <h1 className="head_text_design text-left p-4">
          <span className="blue_gradient">{type} & Edit your Dream Design</span>
        </h1>
        <hr className="mt-1 border-black h-1" />
      </div>

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
                <label>
                  <span className="font-satoshi text-base text-black">
                    Image <span className="text-red-500">*</span>
                  </span>
                </label>
                <div className="flex flex-col items-center justify-center w-full h-32 border bginput rounded-lg cursor-pointer text-black mt-1 mb-4">
                  <label
                    htmlFor="dropzone-file"
                    className="w-full h-full flex flex-col items-center justify-center pt-5 pb-6 cursor-pointer"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <svg
                        className="w-8 h-4 mb-4 text-black"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 16"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                        ></path>
                      </svg>
                      <p className="mb-2 text-sm">
                        <span className="font-semibold">Click to upload</span>{' '}
                        or drag and drop Image
                      </p>
                      <p className="text-xs">PNG or JPG</p>
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

              <button className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center">
                <img
                  src="/assets/icons/wand.png"
                  alt=""
                  width={48}
                  height={48}
                  className="mr-2"
                />
                Generate
              </button>
            </form>
          </div>

          {/* Second column (4/5) */}
          <div className="lg:col-span-4 flex flex-col">
            <h2 className="text-lg font-semibold mb-2">Input</h2>

            {/* Input field */}
            <input
              type="text"
              value={selectedImage || ''}
              readOnly
              className="mb-2 p-2 border border-gray-300 rounded-lg"
              placeholder="Image URL will appear here"
            />

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
                  <span className="absolute top-6 left-6 bg-black text-white px-2 py-1 rounded-md text-sm">
                    BEFORE
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Form;
