const ParametersForm = ({ state, updateState, handleSubmit, handleCancel }) => {
  const handleChange = (e) => {
    updateState({ [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Parameters</h2>
      {/* ... input fields for guidanceScale, numInferenceSteps, promptStrength ... */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Prompt
        </label>
        <textarea
          name="prompt"
          value={state.prompt}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          rows="4"
          required
        />
      </div>
      <div className="flex justify-between">
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          disabled={state.generating}
        >
          {state.loading ? "Processing..." : "Generate"}
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ParametersForm;
