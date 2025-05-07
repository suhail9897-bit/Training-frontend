import { useState } from "react";
import axios from "axios";
import API_BASE_URL from "../../config";

function EditTrainingModal({ training, onClose, onUpdate }) {
  const [formData, setFormData] = useState(training);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await axios.put(`${API_BASE_URL}/api/admin/training/${training._id}`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      onUpdate();
      onClose();
    } catch (err) {
      console.error("Error updating training", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-[#1a1a1a] text-white rounded-lg p-8 w-[950px] shadow-2xl relative overflow-y-auto max-h-[90vh]">
        <button onClick={onClose} className="absolute top-4 right-4 text-xl hover:text-red-500 transition transform hover:scale-110">×</button>
        <h2 className="text-2xl font-bold mb-6">Edit Training</h2>

        <div className="grid grid-cols-2 gap-5">
          {/* training Id */}
          <div>
            <label className="block text-sm font-semibold mb-1">Training ID</label>
            <input name="trainingId" value={formData.trainingId} onChange={handleChange}
              className="w-full p-3 rounded bg-[#111] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition"/>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-semibold mb-1">Title</label>
            <input name="trainingTitle" value={formData.trainingTitle} onChange={handleChange}
              className="w-full p-3 rounded bg-[#111] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition"/>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold mb-1">Description</label>
            <input name="description" value={formData.description} onChange={handleChange}
              className="w-full p-3 rounded bg-[#111] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition"/>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold mb-1">Category</label>
            <input name="category" value={formData.category} onChange={handleChange}
              className="w-full p-3 rounded bg-[#111] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition"/>
          </div>

        

          {/* Duration */}
          <div>
            <label className="block text-sm font-semibold mb-1">Duration (minutes)</label>
            <input type="number" name="duration" value={formData.duration} onChange={handleChange}
              className="w-full p-3 rounded bg-[#111] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition"/>
          </div>

          {/* Start Time */}
          <div>
            <label className="block text-sm font-semibold mb-1">Start Time</label>
            <input type="datetime-local" name="startTime" value={formData.startTime.slice(0,16)} onChange={handleChange}
              className="w-full p-3 rounded bg-[#111] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"/>
          </div>

          {/* End Time */}
          <div>
            <label className="block text-sm font-semibold mb-1">End Time</label>
            <input type="datetime-local" name="endTime" value={formData.endTime.slice(0,16)} onChange={handleChange}
              className="w-full p-3 rounded bg-[#111] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"/>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full py-3 mt-6 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 rounded text-white text-lg shadow-lg transition transform hover:scale-105">
          Save Changes
        </button>
      </div>
    </div>
  );
}

export default EditTrainingModal;
