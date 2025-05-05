import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import API_BASE_URL from "../../config";

const EditChapter = ({ chapter, trainingId, onBack }) => {

    const [name, setName] = useState(chapter.name);
const [description, setDescription] = useState(chapter.description);
const [duration, setDuration] = useState(chapter.duration);
const [dependentChapter, setDependentChapter] = useState(chapter.dependentChapter);
const [mandatory, setMandatory] = useState(chapter.mandatory);
const [pdfFile, setPdfFile] = useState(null);

const handleTextUpdate = async () => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/admin/training/${trainingId}/chapter/${chapter._id}/update`,
        { name, description, duration, dependentChapter, mandatory },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      alert('Chapter text updated successfully!');
    } catch (err) {
      console.error('Error updating chapter:', err);
      alert('Failed to update chapter text');
    }
  };
  
  const handlePdfReplace = async () => {
    if (!pdfFile) {
      alert('Please select a PDF to upload');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('pdf', pdfFile);
      const response = await axios.put(
        `${API_BASE_URL}/api/admin/training/${trainingId}/chapter/${chapter._id}/replace-pdf`,
        formData,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'multipart/form-data' } }
      );
      alert('PDF replaced successfully!');
    } catch (err) {
      console.error('Error replacing PDF:', err);
      alert('Failed to replace PDF');
    }
  };
  
  
  

  return (
    <div className="flex flex-col items-center justify-start w-full min-h-[calc(100vh-64px)] bg-[#121212] text-white px-4 py-8 relative">
      <button
        onClick={onBack}
        className="absolute top-8 left-4 sm:left-8 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 rounded-lg shadow-lg text-sm sm:text-base text-white transition transform hover:scale-105"
      >
        ← Back
      </button>
  
      <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-center break-words">
        Editing Chapter: {chapter.name}
      </h2>
  
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 w-full max-w-3xl lg:max-w-4xl">
        <div>
          <label className="block mb-1 text-green-400 text-sm sm:text-base">Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 sm:p-2.5 rounded text-black focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
          />
        </div>
        <div>
          <label className="block mb-1 text-green-400 text-sm sm:text-base">Duration:</label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full p-2 sm:p-2.5 rounded text-black focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
          />
        </div>
        <div>
          <label className="block mb-1 text-green-400 text-sm sm:text-base">Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 sm:p-2.5 rounded text-black focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
          />
        </div>
        <div>
          <label className="block mb-1 text-green-400 text-sm sm:text-base">Dependent Chapter:</label>
          <input
            type="text"
            value={dependentChapter}
            onChange={(e) => setDependentChapter(e.target.value)}
            className="w-full p-2 sm:p-2.5 rounded text-black focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
          />
        </div>
        <div className="col-span-1 md:col-span-2 flex items-center">
          <input
            type="checkbox"
            checked={mandatory}
            onChange={(e) => setMandatory(e.target.checked)}
            className="mr-2 accent-green-500"
          />
          <span className="text-green-300 text-sm sm:text-base">Mandatory</span>
        </div>
      </div>
  
      <button
        onClick={handleTextUpdate}
        className="w-full max-w-3xl lg:max-w-4xl mt-6 px-4 py-2.5 sm:py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 rounded-lg shadow-lg text-white font-semibold transition transform hover:scale-105 text-sm sm:text-base"
      >
        Update Text Fields
      </button>
  
      <hr className="my-6 border-gray-600 w-full max-w-3xl lg:max-w-4xl" />
  
      <div className="w-full max-w-3xl lg:max-w-4xl">
        <label className="block mb-1 text-green-400 text-sm sm:text-base">Replace PDF:</label>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setPdfFile(e.target.files[0])}
          className="w-full p-2 sm:p-2.5 bg-[#2a2a2a] rounded text-white text-sm sm:text-base"
        />
      </div>
  
      <button
        onClick={handlePdfReplace}
        className="w-full max-w-3xl lg:max-w-4xl mt-4 px-4 py-2.5 sm:py-3 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-500 hover:to-yellow-600 rounded-lg shadow-lg text-black font-semibold transition transform hover:scale-105 text-sm sm:text-base"
      >
        Replace PDF
      </button>
    </div>
  );
  
  
  
  };
  

export default EditChapter;
