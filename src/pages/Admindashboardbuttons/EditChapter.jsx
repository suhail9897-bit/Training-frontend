import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import API_BASE_URL from "../../config";
import IndexButton from './IndexButton';
import LinkTest from './LinkTest';
import EditDependencies from './EditDependencies';





const EditChapter = ({ chapter, trainingId,chapters, onBack,refreshChapters }) => {

    const [name, setName] = useState(chapter.name);
const [description, setDescription] = useState(chapter.description);
const [duration, setDuration] = useState(chapter.duration);

const [pdfFile, setPdfFile] = useState(null);
const [showMeta, setShowMeta] = useState(true);
const [showIndex, setShowIndex] = useState(false);
const [showLinkTest, setShowLinkTest] = useState(false);
const [showSetDeps, setShowSetDeps] = useState(false);
const [linkedTestId, setLinkedTestId] = useState(chapter.linkedTestId || '');
const [localChapter, setLocalChapter] = useState(chapter); // ← mutable copy



const baseButtonStyle = "px-4 py-2 rounded-lg text-white shadow transition transform hover:scale-105";
const activeStyle = "bg-blue-900";
const inactiveStyle = "bg-gradient-to-r from-blue-500 to-blue-400 hover:from-blue-700 hover:to-blue-800";



const handleTextUpdate = async () => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/admin/training/${trainingId}/chapter/${chapter._id}/update`,
        { name, description, duration },
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
            setShowLinkTest(false);
            setShowSetDeps(false); 
          }}
          className={`${baseButtonStyle} ${showMeta ? activeStyle : inactiveStyle}`}
>
          Edit Meta Data
        </button>
        <button
          onClick={() => {
            setShowMeta(false);
            setShowIndex(true);
            setShowLinkTest(false);
            setShowSetDeps(false); 
          }}
          className={`${baseButtonStyle} ${showIndex ? activeStyle : inactiveStyle}`}
>
          Update Index
        </button>
        <button
  onClick={() => {
    setShowMeta(false);
    setShowIndex(false);
    setShowLinkTest(true);
    setShowSetDeps(false); 
  }}
  className={`${baseButtonStyle} ${showLinkTest ? activeStyle : inactiveStyle}`}
>
  Link Test
</button>

<button
  onClick={() => {
    setShowMeta(false);
    setShowIndex(false);
    setShowLinkTest(false);
    setShowSetDeps(true); // ← Here
  }}
  className={`${baseButtonStyle} ${showSetDeps ? activeStyle : inactiveStyle}`}
>
    Edit Dependencies
  </button>
  



      </div>

      <h2 className="text-xl font-semibold text-green-400 mb-4">
  Currently Editing: <span className="text-white">{chapter.name}</span>
</h2>

  
      {showMeta && (
        <div className="flex flex-col items-center justify-start w-full max-w-lg bg-[#121212] text-white px-4 py-4">
         
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
  min={1}
  step={1}
  onInput={(e) => {
    const value = e.target.value;
    if (/^\d+$/.test(value)) {
      setDuration(value);
    } else if (value === "") {
      setDuration(""); // allow empty temporarily
    }
  }}
  onKeyDown={(e) => {
    // prevent decimal point and minus
    if (e.key === "." || e.key === "-" || e.key === "e") {
      e.preventDefault();
    }
  }}
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

  {chapter.pdf && !pdfFile && (
    <p className="mb-1 text-xs text-yellow-400 italic">Current File: {chapter.pdf.split('/').pop()}</p>
  )}

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

{showLinkTest && (
  <div className="w-full max-w-2xl">
  <LinkTest
    key={chapter._id + (chapter.linkedTestId || '')}
  trainingId={trainingId}
  chapters={[localChapter]}
  fixedChapterId={chapter._id}  // 👈 pass fixed chapter
  initialLinkedTestId={linkedTestId}
  onTestLinked={(newId) => {
    const updated = { ...localChapter, linkedTestId: newId };
    setLocalChapter(updated);
    setLinkedTestId(newId);
    refreshChapters(); // so other views also update
  }}
  onBack={() => {
    setShowLinkTest(false);
    setShowMeta(true);
  }}
    />
  </div>
)}

{showSetDeps && (
  <div className="w-full max-w-2xl">
    <EditDependencies
      trainingId={trainingId}
      chapterId={chapter._id}
      chapters={[...chapters]}
      
      onBack={() => {
        setShowSetDeps(false);
        setShowMeta(true);
      }}
    />
  </div>
)}

    </div>
  );
   
  };
  

export default EditChapter;



