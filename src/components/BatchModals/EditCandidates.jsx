import React, { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "../../config";

const EditCandidates = ({ candidate, onClose, onUpdated }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (candidate) {
      setFormData(candidate);
    }
  }, [candidate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      const res = await axios.put(
        `${API_BASE_URL}/api/admin/batch/candidate/update/${candidate._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert("Candidate updated successfully!");
      onUpdated(res.data); // pass updated data to parent
      onClose(); // close modal
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update candidate.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-[#1a1a1a] text-white rounded-lg p-6 w-[600px] shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-xl hover:text-red-500 transition transform hover:scale-110"
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-4 text-green-400">Edit Candidate</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          {Object.entries(formData).map(([key, value]) => (
           key !== "_id" && key !== "__v" && key !== "fileId" && key !== "batch" && key !== "rawData"
 && (
              <div key={key}>
                <label className="block mb-1 capitalize">{key}</label>
                <input
                  type="text"
                  name={key}
                  value={value || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-1 bg-[#2a2a2a] border border-gray-600 rounded text-white focus:outline-none"
                />
              </div>
            )
          ))}
        </div>
        <button
          onClick={handleUpdate}
          className="mt-6 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded"
        >
          ✅ Update Candidate
        </button>
      </div>
    </div>
  );
};

export default EditCandidates;
