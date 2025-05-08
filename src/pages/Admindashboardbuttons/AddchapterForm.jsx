import React, { useState } from 'react';
import axios from 'axios';
import API_BASE_URL from "../../config";
import IndexButton from './IndexButton';


function AddchapterForm({ onBack, trainingId,  chapters, refreshChapters }) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    dependentChapter: '',
    duration: '',
    pdf: null,
    mandatory: 'false',
  });

  const [showIndexSection, setShowIndexSection] = useState(false);
const [selectedChapterId, setSelectedChapterId] = useState('');

  


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
      setFormData({
        name: '',
        description: '',
        dependentChapter: '',
        duration: '',
        pdf: null,
        mandatory: 'false',
      });
      refreshChapters();

    } catch (err) {
      console.error("API Error:", err);
      alert('Error adding chapter: ' + (err?.response?.data?.message || err.message));
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-64px)] bg-[#121212] text-white p-8 flex flex-col items-center">
    <div className="flex gap-4 mb-6">
      <button
        onClick={onBack}
        className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 rounded-lg text-white shadow transition transform hover:scale-105"
      >
        ← Back
      </button>
      <button
          onClick={() => {
            setShowForm(true);
            setShowIndexSection(false);
          }}
        className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 rounded-lg text-white shadow transition transform hover:scale-105"
      >
        Meta data
      </button>
      <button
       onClick={() => {
        setShowForm(false);
        setShowIndexSection(true);
      }}
        
        className="px-4 py-2 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-500 hover:to-yellow-600 rounded-lg text-white shadow transition transform hover:scale-105"
      >
        Index
      </button>
    </div>
  
    {showForm && (
      <form onSubmit={handleSubmit} className="w-full max-w-3xl space-y-4">
        <div className="flex gap-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="flex-1 p-2 rounded bg-[#2a2a2a]"
            required
          />
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="flex-1 p-2 rounded bg-[#2a2a2a]"
            required
          />
        </div>
        <div className="flex gap-4">
          <input
            type="text"
            name="dependentChapter"
            placeholder="Dependent Chapter"
            value={formData.dependentChapter}
            onChange={handleChange}
            className="flex-1 p-2 rounded bg-[#2a2a2a]"
          />
          <input
            type="number"
            name="duration"
            placeholder="Duration (minutes)"
            value={formData.duration}
            onChange={handleChange}
            className="flex-1 p-2 rounded bg-[#2a2a2a]"
            required
          />
        </div>
        <select
          name="mandatory"
          value={formData.mandatory}
          onChange={handleChange}
          className="w-full p-2 rounded bg-[#2a2a2a]"
          required
        >
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="w-full p-2 rounded bg-[#2a2a2a] text-white"
          required
        />
        <button
          type="submit"
          className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 rounded text-white"
        >
          Save Chapter
        </button>
      </form>
    )}

{showIndexSection && (
  <>
    <select
      value={selectedChapterId}
      onChange={(e) => setSelectedChapterId(e.target.value)}
      className="p-1 rounded bg-[#2a2a2a] "
    >
      <option value="">Select Chapter</option>
      {chapters.map((ch) => (
        <option key={ch._id} value={ch._id}>{ch.name}</option>
      ))}
    </select>

    {selectedChapterId && (
      <IndexButton
        onBack={() => setShowIndexSection(false)}
        trainingId={trainingId}
        chapter={chapters.find((ch) => ch._id === selectedChapterId)}
      />
    )}
  </>
)}
  </div>
  
  );
}

export default AddchapterForm;
