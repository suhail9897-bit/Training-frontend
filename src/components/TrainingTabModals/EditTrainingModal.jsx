import { useState } from "react";
import axios from "axios";
import API_BASE_URL from "../../config";

function EditTrainingModal({ training, onClose, onUpdate }) {
  const [formData, setFormData] = useState(training);
  const [videoFile, setVideoFile] = useState(null);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {

    const start = new Date(formData.startTime);
    const end = new Date(formData.endTime);
  
    if (end <= start) {
      alert("End time must be greater than start time.");
      return;
    }
    try {
      const data = new FormData();
data.append("trainingId", formData.trainingId);
data.append("trainingTitle", formData.trainingTitle);
data.append("description", formData.description);
data.append("category", formData.category);
data.append("duration", formData.duration);
data.append("startTime", formData.startTime);
data.append("endTime", formData.endTime);
if (videoFile) {
  data.append("video", videoFile);
}

await axios.put(`${API_BASE_URL}/api/admin/training/${training._id}`, data, {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "multipart/form-data",
  },
});

      onUpdate();
      onClose();
    } catch (err) {
      console.error("Error updating training", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-[#1a1a1a] text-white rounded-lg p-4 w-full max-w-md shadow-2xl relative overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-base hover:text-red-500 transition transform hover:scale-110"
        >
          ×
        </button>
        <h2 className="text-lg font-bold mb-4">Edit Training</h2>
  
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* training Id */}
          <div>
            <label className="block text-xs font-semibold mb-1">Training ID</label>
            <input
              name="trainingId"
              value={formData.trainingId}
              onChange={handleChange}
              className="w-full p-1.5 rounded bg-[#111] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition text-sm"
            />
          </div>
  
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold mb-1">Title</label>
            <input
              name="trainingTitle"
              value={formData.trainingTitle}
              onChange={handleChange}
              className="w-full p-1.5 rounded bg-[#111] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition text-sm"
            />
          </div>
  
          {/* Description */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold mb-1">Description</label>
            <input
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-1.5 rounded bg-[#111] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition text-sm"
            />
          </div>
  
          {/* Category */}
          <div>
            <label className="block text-xs font-semibold mb-1">Category</label>
            <select
    name="category"
    value={formData.category}
    onChange={handleChange}
    className="w-full p-1.5 rounded bg-[#111] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition text-sm"
    required
  >
    <option value="">Select a category</option>
    <option value="Web Development">Web Development</option>
    <option value="AI">AI</option>
    <option value="VLSI">VLSI</option>
    <option value="DSA">DSA</option>
    <option value="Frontend">Frontend</option>
    <option value="Backend">Backend</option>
  </select>
          </div>
  
          {/* Duration */}
          <div>
            <label className="block text-xs font-semibold mb-1">Duration (minutes)</label>
            <input
              type="number"
              name="duration"
              step="1" // ✅ Force only integers
              min="1"
              value={formData.duration}
              onChange={handleChange}
              onInput={(e) => {
                e.target.value = e.target.value.replace(/\D/g, ''); // ✅ allow only digits
              }}
              className="w-full p-1.5 rounded bg-[#111] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition text-sm"
            />
          </div>
  
          {/* Start Time */}
          <div>
            <label className="block text-xs font-semibold mb-1">Start Time</label>
            <input
              type="datetime-local"
              name="startTime"
              value={formData.startTime.slice(0, 16)}
              onChange={handleChange}
              className="w-full p-1.5 rounded bg-[#111] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition text-sm [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
            />
          </div>
  
          {/* End Time */}
          <div>
            <label className="block text-xs font-semibold mb-1">End Time</label>
            <input
              type="datetime-local"
              name="endTime"
              value={formData.endTime.slice(0, 16)}
              onChange={handleChange}
              min={formData.startTime.slice(0, 16)}
              className="w-full p-1.5 rounded bg-[#111] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition text-sm [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
            />
          </div>
        </div>
        <div className="sm:col-span-2 mt-3">
  <label className="block text-xs font-semibold mb-1">Replace Video (optional)</label>
  {videoFile ? (
  <div className="flex items-center justify-between mt-2 p-2 bg-[#111] border border-gray-600 rounded">
    <span className="text-sm text-gray-300 truncate max-w-[80%]">{videoFile.name}</span>
    <button
      onClick={() => setVideoFile(null)}
      className="text-red-400 text-lg hover:text-red-500"
      title="Remove selected video"
    >
      ×
    </button>
  </div>
) : (
  <input
    type="file"
    accept="video/*"
    onChange={(e) => setVideoFile(e.target.files[0])}
    className="w-full p-1.5 rounded bg-[#111] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition text-sm"
  />
)}

</div>

  
        <button
          onClick={handleSubmit}
          className="w-full py-2 mt-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 rounded text-white text-sm shadow-lg transition transform hover:scale-105"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
  
}

export default EditTrainingModal;
