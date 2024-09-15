import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";

const ImageDisplay = ({ image, label, downloading, generating, children }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">{label}</h2>
      {generating ? (
        children
      ) : image ? (
        <div className="relative">
          <img src={image} alt={label} className="rounded-lg w-full" />
          <button
            onClick={downloading}
            className="absolute bottom-4 right-4 bg-white text-gray-800 p-2 rounded-full shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
            title="Download Image"
          >
            <FontAwesomeIcon icon={faDownload} className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
          <p className="text-gray-500">No image generated yet</p>
        </div>
      )}
    </div>
  );
};

export default ImageDisplay;
