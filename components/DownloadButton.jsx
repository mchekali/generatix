// components/DownloadButton.js
import React from "react";

const DownloadButton = ({ imageUrl }) => {
  return (
    <a
      href={imageUrl}
      download
      className="absolute bottom-4 right-4 bg-blue-500 text-white py-2 px-4 rounded-full shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      Download
    </a>
  );
};

export default DownloadButton;
