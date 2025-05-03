import React from 'react';



const DeleteTrainingModal = ({ show, onClose, onConfirm, trainingName }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm z-50">
      <div className="bg-[#111827] rounded-lg shadow-2xl text-white w-[90%] max-w-md p-6 relative animate-fade-in">
        {/* Close icon */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-green-400 hover:text-green-500 transition text-xl"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold text-center mb-4 tracking-wide">Confirm Delete</h2>

        <p className="text-center text-green-300 mb-6">
          Are you sure you want to delete <span className="font-semibold text-green-400">"{trainingName}"</span>?
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={onConfirm}
            className="px-6 py-2 bg-red-600 hover:bg-red-500 transition rounded-lg text-white font-semibold shadow-lg"
          >
            Yes, Delete
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 hover:bg-gray-500 transition rounded-lg text-white font-semibold shadow-lg"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteTrainingModal;
