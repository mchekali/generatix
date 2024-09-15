import { useCallback } from "react";

const ImageUploader = ({ selectedImage, updateState }) => {
  const MAX_FILE_SIZE = 2 * 1024 * 1024;

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.size > MAX_FILE_SIZE) {
      alert("File size exceeds the 2 MB limit. Please upload a smaller file.");
      return;
    }
    processFile(file);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file && file.size > MAX_FILE_SIZE) {
        alert(
          "File size exceeds the 2 MB limit. Please upload a smaller file.",
        );
        return;
      }
      processFile(file);
    }
  }, []);

  const processFile = (file) => {
    const url = URL.createObjectURL(file);
    updateState({ selectedImage: url });

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      updateState({ imageUrl: reader.result });
    };
  };

  // ... drag event handlers ...

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Input Image</h2>
      {/* ... dropzone implementation ... */}
      {selectedImage && (
        <img
          src={selectedImage}
          alt="Selected"
          className="mt-4 rounded-lg w-full"
        />
      )}
    </div>
  );
};

export default ImageUploader;
