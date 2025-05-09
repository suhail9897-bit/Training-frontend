import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import API_BASE_URL from "../../config";
import IndexButton from './IndexButton';

const EditChapter = ({ chapter, trainingId, onBack,refreshChapters }) => {

    const [name, setName] = useState(chapter.name);
const [description, setDescription] = useState(chapter.description);
const [duration, setDuration] = useState(chapter.duration);
const [dependentChapter, setDependentChapter] = useState(chapter.dependentChapter);
const [mandatory, setMandatory] = useState(chapter.mandatory);
const [pdfFile, setPdfFile] = useState(null);
const [showMeta, setShowMeta] = useState(true);
const [showIndex, setShowIndex] = useState(false);



const handleTextUpdate = async () => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/admin/training/${trainingId}/chapter/${chapter._id}/update`,
        { name, description, duration, dependentChapter, mandatory },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      alert('Chapter text updated successfully!');
      refreshChapters();
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
      refreshChapters();
    } catch (err) {
      console.error('Error replacing PDF:', err);
      alert('Failed to replace PDF');
    }
  };
  
  
  

  return (
    <div className="flex flex-col items-center justify-start w-full min-h-[calc(100vh-64px)] bg-[#121212] text-white px-4 py-6">
      <div className="flex gap-4 mb-4">
        <button
          onClick={onBack}
          className="px-3 py-1.5 bg-red-600 hover:bg-red-500 rounded-md shadow text-sm font-medium"
        >
          ← Back
        </button>
        <button
          onClick={() => {
            setShowMeta(true);
            setShowIndex(false);
          }}
          className="px-3 py-1.5 bg-green-600 hover:bg-green-500 rounded-md shadow text-sm font-medium"
        >
          Edit Meta Data
        </button>
        <button
          onClick={() => {
            setShowMeta(false);
            setShowIndex(true);
          }}
          className="px-3 py-1.5 bg-yellow-600 hover:bg-yellow-500 rounded-md shadow text-sm font-medium"
        >
          Update Index
        </button>
      </div>
  
      {showMeta && (
        <div className="flex flex-col items-center justify-start w-full max-w-lg bg-[#121212] text-white px-4 py-4">
          <h2 className="text-lg font-semibold mb-4 text-center">
            Editing Chapter: {chapter.name}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
            <div>
              <label className="block text-xs text-green-400 mb-1">Name:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-1 rounded text-black text-xs"
              />
            </div>
            <div>
              <label className="block text-xs text-green-400 mb-1">Duration:</label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full p-1 rounded text-black text-xs"
              />
            </div>
            <div>
              <label className="block text-xs text-green-400 mb-1">Description:</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-1 rounded text-black text-xs"
              />
            </div>
            <div>
              <label className="block text-xs text-green-400 mb-1">Dependent Chapter:</label>
              <input
                type="text"
                value={dependentChapter}
                onChange={(e) => setDependentChapter(e.target.value)}
                className="w-full p-1 rounded text-black text-xs"
              />
            </div>
            <div className="col-span-1 md:col-span-2 flex items-center mt-1">
              <input
                type="checkbox"
                checked={mandatory}
                onChange={(e) => setMandatory(e.target.checked)}
                className="mr-1"
              />
              <span className="text-green-300 text-xs">Mandatory</span>
            </div>
          </div>
  
          <button
            onClick={handleTextUpdate}
            className="mt-4 w-full py-1.5 bg-green-600 hover:bg-green-500 rounded text-white text-xs font-medium"
          >
            Update Text Fields
          </button>
  
          <hr className="my-4 border-gray-600 w-full" />
  
          <div className="w-full">
            <label className="block text-xs text-green-400 mb-1">Replace PDF:</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setPdfFile(e.target.files[0])}
              className="w-full p-1 bg-[#2a2a2a] rounded text-white text-xs"
            />
          </div>
  
          <button
            onClick={handlePdfReplace}
            className="mt-3 w-full py-1.5 bg-yellow-600 hover:bg-yellow-500 rounded text-black text-xs font-medium"
          >
            Replace PDF
          </button>
        </div>
      )}
  
      {showIndex && (
        <div className="w-full max-w-2xl">
          <IndexButton
            onBack={() => {
              setShowIndex(false);
              setShowMeta(true);
            }}
            trainingId={trainingId}
            chapter={chapter}
          />
        </div>
      )}
    </div>
  );
  
  



  
  
  };
  

export default EditChapter;



