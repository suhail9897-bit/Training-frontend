import React from 'react';

const DeleteChapterModal = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-[#1e1e1e] p-6 rounded-lg shadow-lg w-80 text-center">
        <h3 className="text-lg font-semibold text-white mb-4">Are you sure?</h3>
        <p className="text-sm text-gray-300 mb-6">This action will delete the chapter permanently.</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded shadow"
          >
            Yes
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded shadow"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteChapterModal;
