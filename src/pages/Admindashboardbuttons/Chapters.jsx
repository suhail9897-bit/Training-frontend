function Chapters({ onBack }) {
    return (
      <div className="flex flex-col items-start w-full min-h-[calc(100vh-64px)] bg-[#121212] text-white p-8">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 rounded-lg text-white shadow transition transform hover:scale-105 mb-6"
        >
          ← Back
        </button>
        <h1 className="text-3xl font-bold mb-4">Chapters for Training</h1>
  
        {/* Baad me table yahan add karenge */}
        <p className="text-gray-400">Chapters list will appear here...</p>
      </div>
    );
  }
  
  export default Chapters;
  