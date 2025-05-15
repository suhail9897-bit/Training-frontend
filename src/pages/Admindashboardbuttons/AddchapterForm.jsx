import React, { useState } from 'react';
import axios from 'axios';
import API_BASE_URL from "../../config";
import IndexSection from '../../components/ThreeSections/IndexSection';
import LinkTestSection from '../../components/ThreeSections/LinkTestSection';
import SetDependenciesSection from '../../components/ThreeSections/SetDependenciesSection';


function AddchapterForm({ onBack, trainingId, refreshChapters }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: '',
    pdf: null,
  });
  const [chapterSaved, setChapterSaved] = useState(false);
const [newChapterId, setNewChapterId] = useState(null);



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, pdf: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('duration', formData.duration);
      data.append('pdf', formData.pdf);

      const response = await axios.post(`${API_BASE_URL}/api/admin/training/${trainingId}/chapter`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // ✅ Get chapterId from response and store it
      const chapterId = response.data?.chapter?._id;
      setNewChapterId(chapterId);
      console.log("Created Chapter ID:", chapterId);

      

      alert('Chapter added successfully!');
      setFormData({ name: '', description: '', duration: '', pdf: null });
      refreshChapters();
      setChapterSaved(true);

    } catch (err) {
      console.error(err);
      alert('Failed to add chapter');
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-64px)] bg-[#121212] text-white px-6 pt-6">
      {/* Back button */}
      <div className="mb-4">
        <button
          onClick={onBack}
          className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm shadow"
        >
          ← Back
        </button>
      </div>
  
      {/* Four-section row layout */}
      <div className="flex gap-4">
        {/* Meta Data Form */}
        {/* Meta Data Form */}
<div className="bg-[#1f1f1f] p-4 rounded shadow w-1/4">
  <h2 className="text-lg font-semibold text-green-400 mb-4">Meta Data</h2>
  <form onSubmit={handleSubmit} className="space-y-3">
    <fieldset disabled={chapterSaved} className="space-y-3">
      <input
        type="text"
        name="name"
        placeholder="Chapter Name"
        value={formData.name}
        onChange={handleChange}
        className="w-full p-2 bg-[#2a2a2a] rounded"
        required
      />
      <input
        type="text"
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        className="w-full p-2 bg-[#2a2a2a] rounded"
        required
      />
      <input
        type="number"
        name="duration"
        placeholder="Duration (minutes)"
        value={formData.duration}
        onChange={handleChange}
        className="w-full p-2 bg-[#2a2a2a] rounded"
        required
      />
      <input
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        className="w-full p-2 bg-[#2a2a2a] rounded text-white"
        required
      />
      <button
        type="submit"
        className="w-full py-2 bg-green-600 hover:bg-green-700 rounded text-white font-semibold"
      >
        Save Chapter
      </button>
    </fieldset>
  </form>
</div>

  
        {/* Three other sections */}
        <div className="w-3/4 flex gap-4">
          <div className={`bg-[#1f1f1f] p-4 rounded shadow ${!chapterSaved && 'opacity-50 pointer-events-none'}`}>
          <IndexSection trainingId={trainingId} chapterId={newChapterId} />


          </div>
          <div className={`bg-[#1f1f1f] p-4 rounded shadow w-1/2 space-y-6 ${!chapterSaved && 'opacity-50 pointer-events-none'}`}>
  <LinkTestSection trainingId={trainingId} chapterId={newChapterId} />
  <div className="border-t border-gray-700 pt-4">
    <SetDependenciesSection trainingId={trainingId} chapterId={newChapterId} />
  </div>
</div>

        </div>
      </div>
    </div>
  );
  
}

export default AddchapterForm;
