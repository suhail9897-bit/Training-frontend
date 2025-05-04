import { useState } from "react";
import axios from "axios";
import API_BASE_URL from "../../config";

function AddTrainingForm({ onBack }) {
  const [formData, setFormData] = useState({
    trainingId: "",
    trainingTitle: "",
    description: "",
    category: "",
    subject: "",
    level: "",
    language: "",
    duration: "",
    startTime: "",
    endTime: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/api/admin/Add-Training`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      alert("Training added successfully!");
      setFormData({
        trainingId: "",
        trainingTitle: "",
        description: "",
        category: "",
        subject: "",
        level: "",
        language: "",
        duration: "",
        startTime: "",
        endTime: "",
      });
    } catch (err) {
      console.error(err);
      alert("Error adding training");
    }
  };

  return (
    <div className="w-full h-[calc(100vh-48px)] bg-[#0a0f1a] text-green-400 flex flex-col p-8 overflow-auto">
      <button
        onClick={onBack}
        className="mb-6 self-start px-4 py-2 bg-green-700 hover:bg-green-600 text-white rounded shadow-md transition duration-300"
      >
        ← Back
      </button>
  
      <h2 className="text-3xl font-bold mb-8 text-center tracking-wide">Add New Training</h2>
  
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full px-0 md:px-12"
      >
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-semibold tracking-wide">Training ID</label>
          <input
            type="text"
            name="trainingId"
            placeholder="Enter Training ID"
            value={formData.trainingId}
            onChange={handleChange}
            className="p-4 rounded-lg bg-[#111827] text-white placeholder-green-400 border border-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-inner transition duration-300"
            required
          />
        </div>
  
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-semibold tracking-wide">Training Title</label>
          <input
            type="text"
            name="trainingTitle"
            placeholder="Enter Training Title"
            value={formData.trainingTitle}
            onChange={handleChange}
            className="p-4 rounded-lg bg-[#111827] text-white placeholder-green-400 border border-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-inner transition duration-300"
            required
          />
        </div>
  
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-semibold tracking-wide">Category</label>
          <input
            type="text"
            name="category"
            placeholder="Enter Category"
            value={formData.category}
            onChange={handleChange}
            className="p-4 rounded-lg bg-[#111827] text-white placeholder-green-400 border border-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-inner transition duration-300"
            required
          />
        </div>
  
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-semibold tracking-wide">Subject</label>
          <input
            type="text"
            name="subject"
            placeholder="Enter Subject"
            value={formData.subject}
            onChange={handleChange}
            className="p-4 rounded-lg bg-[#111827] text-white placeholder-green-400 border border-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-inner transition duration-300"
            required
          />
        </div>
  
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-semibold tracking-wide">Level</label>
          <input
            type="text"
            name="level"
            placeholder="Enter Level"
            value={formData.level}
            onChange={handleChange}
            className="p-4 rounded-lg bg-[#111827] text-white placeholder-green-400 border border-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-inner transition duration-300"
            required
          />
        </div>
  
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-semibold tracking-wide">Language</label>
          <input
            type="text"
            name="language"
            placeholder="Enter Language"
            value={formData.language}
            onChange={handleChange}
            className="p-4 rounded-lg bg-[#111827] text-white placeholder-green-400 border border-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-inner transition duration-300"
            required
          />
        </div>
  
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-semibold tracking-wide">Duration of Training (Minutes)</label>
          <input
            type="number"
            name="duration"
            placeholder="Enter Duration in Minutes"
            value={formData.duration}
            onChange={handleChange}
            className="p-4 rounded-lg bg-[#111827] text-white placeholder-green-400 border border-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-inner transition duration-300"
            required
          />
        </div>
  
        <div className="flex flex-col">
  <label className="mb-1 text-sm font-semibold tracking-wide">Course Start Time</label>
  <input
    type="datetime-local"
    name="startTime"
    value={formData.startTime}
    onChange={handleChange}
    className="p-4 rounded-lg bg-[#111827] text-white border border-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-inner transition duration-300 [color-scheme:dark]"
    required
  />
</div>

<div className="flex flex-col">
  <label className="mb-1 text-sm font-semibold tracking-wide">Course End Time</label>
  <input
    type="datetime-local"
    name="endTime"
    value={formData.endTime}
    onChange={handleChange}
    className="p-4 rounded-lg bg-[#111827] text-white border border-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-inner transition duration-300 [color-scheme:dark]"
    required
  />
</div>

  
        <div className="flex flex-col md:col-span-2">
          <label className="mb-1 text-sm font-semibold tracking-wide">Description</label>
          <textarea
            name="description"
            placeholder="Enter Description"
            value={formData.description}
            onChange={handleChange}
            className="p-4 rounded-lg bg-[#111827] text-white placeholder-green-400 border border-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-inner transition duration-300"
            required
          ></textarea>
        </div>
  
        <button
          type="submit"
          className="md:col-span-2 px-6 py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white rounded-lg shadow-xl transition-all text-lg font-semibold tracking-wide"
        >
          Save Training
        </button>
      </form>
    </div>
  );
  
  

}

export default AddTrainingForm;
