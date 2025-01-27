const ProgressBar = ({ progress }) => {
  return (
    <div className="w-full">
      <div className="flex mb-2 items-center justify-between">
        <div className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-teal-600 bg-teal-200">
          In Progress
        </div>
        <div className="text-right">
          <span className="text-xs font-semibold inline-block text-teal-600">
            {progress} seconds
          </span>
        </div>
      </div>
      <div className="flex h-2 mb-4 overflow-hidden bg-teal-200 rounded">
        <div
          style={{ width: `${progress}%` }}
          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-teal-500"
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
