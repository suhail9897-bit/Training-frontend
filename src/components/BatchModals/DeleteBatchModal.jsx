import React from "react";
import axios from "axios";
import API_BASE_URL from "../../config";

const DeleteBatchModal = ({ batch, onClose, onDeleted }) => {
  const handleDelete = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/api/admin/batch/${batch._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      alert(`Batch '${batch.name}' deleted successfully!`);
      onDeleted();
    } catch (err) {
      console.error("Error deleting batch:", err);
      alert("Failed to delete batch.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-[#1e1e1e] p-6 rounded-lg w-[400px]">
        <h2 className="text-xl font-semibold text-red-400 mb-4">Delete Batch</h2>

        <p className="text-white text-sm mb-6">
          Are you sure you want to delete{" "}
          <span className="font-bold text-red-400">"{batch.name}"</span>?
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded text-sm"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteBatchModal;
