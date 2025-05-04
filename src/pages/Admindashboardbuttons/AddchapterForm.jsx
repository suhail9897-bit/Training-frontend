import { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from "../../config";

function AddchapterForm({ onBack, trainingId }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    dependentChapter: '',
    duration: '',
    pdf: null,
    mandatory: 'false',
  });

  useEffect(() => {
    console.log("AddchapterForm.jsx → received trainingId:", trainingId);
  }, [trainingId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, pdf: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('dependentChapter', formData.dependentChapter);
      data.append('duration', formData.duration);
      data.append('pdf', formData.pdf);
      data.append('mandatory', formData.mandatory);


      const response = await axios.post(
        `${API_BASE_URL}/api/admin/training/${trainingId}/chapter`,
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      alert('Chapter added successfully!');
      onBack();
    } catch (err) {
      console.error("API Error:", err);
      alert('Error adding chapter: ' + (err?.response?.data?.message || err.message));
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-64px)] bg-[#121212] text-white p-8 flex justify-center">
  <div className="w-full max-w-4xl">

      <button
        onClick={onBack}
        className="mb-6 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 rounded-lg text-white shadow transition transform hover:scale-105"
      >
        ← Back
      </button>
  
      <h1 className="text-4xl font-bold mb-8">Add New Chapter</h1>
  
      <form onSubmit={handleSubmit} className="max-w-6xl space-y-6">
        {/* ROW 1 */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-[#2a2a2a] border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm mb-1">Description</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-[#2a2a2a] border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
        </div>
  
        {/* ROW 2 */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm mb-1">Dependent Chapter</label>
            <input
              type="text"
              name="dependentChapter"
              value={formData.dependentChapter}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-[#2a2a2a] border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm mb-1">Duration (in minutes)</label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-[#2a2a2a] border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
        </div>
                {/* ROW 3 (Mandatory Select) */}
        <div>
        <label className="block text-sm mb-1">Mandatory</label>
        <select
            name="mandatory"
            value={formData.mandatory}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-[#2a2a2a] border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            required
        >
            <option value="true">Yes</option>
            <option value="false">No</option>
        </select>
        </div>

  
        {/* ROW 4 (PDF Upload) */}
        <div>
          <label className="block text-sm mb-1">Upload PDF</label>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="w-full p-3 rounded-lg bg-[#2a2a2a] text-white"
            required
          />
        </div>
  
        <button
          type="submit"
          className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 rounded-lg text-white shadow transition transform hover:scale-105"
        >
          Save Chapter
        </button>
      </form>
    </div>
    </div>
  );
  
  
}

export default AddchapterForm;
