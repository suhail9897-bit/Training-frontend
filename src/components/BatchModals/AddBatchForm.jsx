import React, { useState } from "react";
import axios from "axios";
import API_BASE_URL from "../../config";

const AddBatchForm = ({ onClose, onBatchAdded }) => {
  const [batchName, setBatchName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [description, setDescription] = useState("");


  const handleAddBatch = async () => {
     if (!batchName || !startTime || !endTime) return alert("All fields are required");

if (new Date(startTime) >= new Date(endTime)) {
  return alert("Start time must be earlier than end time");
}

    try {
      await axios.post(
        `${API_BASE_URL}/api/admin/batch`,
        { name: batchName, startTime, endTime, description }
,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("Batch added!");
      onBatchAdded(); // refresh batch list in parent
      onClose();      // close modal
    } catch (err) {
      console.error("Batch add error:", err);
      alert("Failed to add batch");
    }
  };

  return (
  <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
    <div className="bg-gradient-to-br from-[#1f1f1f] to-[#2b2b2b] border border-[#3a3a3a] shadow-2xl rounded-xl p-6 w-[430px]">
      <h2 className="text-2xl font-bold text-green-400 mb-6 text-center tracking-wide">
        🎓 Add New Batch
      </h2>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Batch Name"
          value={batchName}
          onChange={(e) => setBatchName(e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-[#111] text-white text-sm border border-[#333] focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <textarea
  placeholder="Batch Description"
  value={description}
  onChange={(e) => setDescription(e.target.value)}
  className="w-full px-4 py-2 rounded-lg bg-[#111] text-white text-sm border border-[#333] focus:outline-none focus:ring-2 focus:ring-green-500"
  rows={3}
/>

        <input
          type="datetime-local"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
             className="w-full px-4 py-2 rounded-lg bg-[#111] text-white text-sm border border-[#333] focus:outline-none focus:ring-2 focus:ring-green-500 [color-scheme:dark]"
/>
        <input
          type="datetime-local"
          value={endTime}
          min={startTime}
          onChange={(e) => setEndTime(e.target.value)}
           className="w-full px-4 py-2 rounded-lg bg-[#111] text-white text-sm border border-[#333] focus:outline-none focus:ring-2 focus:ring-green-500 [color-scheme:dark]"
/>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-all duration-150"
        >
          Cancel
        </button>
        <button
          onClick={handleAddBatch}
          className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg text-sm transition-all duration-150 shadow-md"
        >
          Save
        </button>
      </div>
    </div>
  </div>
);

};

export default AddBatchForm;
