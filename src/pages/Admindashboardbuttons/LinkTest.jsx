import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../config';
import TestPreviewModal from '../../components/TestModals/TestPreviewModal';

function LinkTest({ trainingId, chapters, onBack, fixedChapterId = null, initialLinkedTestId = '', onTestLinked = () => {} }) {


  const [selectedChapterId, setSelectedChapterId] = useState(fixedChapterId || '');
  const [tests, setTests] = useState([]);
  const [selectedTestId, setSelectedTestId] = useState('');
  const [previewId, setPreviewId] = useState(null);

  const [linkedTestId, setLinkedTestId] = useState('');

  

  const fetchTests = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/admin/tests`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setTests(res.data);
    } catch (err) {
      console.error('Error fetching tests:', err);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);


  useEffect(() => {
    if (fixedChapterId) {
      setSelectedChapterId(fixedChapterId);
      setLinkedTestId(initialLinkedTestId || '');
    }
  }, [fixedChapterId, initialLinkedTestId]);
  
  

  useEffect(() => {
    setLinkedTestId(initialLinkedTestId || '');
  }, [initialLinkedTestId]);
  

  const handleLinkTest = async () => {
    try {
      await axios.put(
        `${API_BASE_URL}/api/admin/training/${trainingId}/chapter/${selectedChapterId}/link-test`,
        { testId: selectedTestId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      alert('Test linked successfully!');
      setLinkedTestId(selectedTestId);
      onTestLinked(selectedTestId);
      
      
    } catch (err) {
      console.error('Error linking test:', err);
      alert('Failed to link test');
    }
    
  };

  const handleDownload = async () => {
    try {
      const test = tests.find((t) => t._id === linkedTestId);
      const res = await axios.get(`${API_BASE_URL}/api/admin/test/${linkedTestId}/download`, {
        responseType: 'blob',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${test.title}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Download error', err);
      alert('Failed to download test file');
    }
  };


  const handleUnlinkTest = async () => {
    try {
      await axios.put(
        `${API_BASE_URL}/api/admin/training/${trainingId}/chapter/${selectedChapterId}/unlink-test`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      alert('Test unlinked successfully!');
      setLinkedTestId('');
      onTestLinked('');
    } catch (err) {
      console.error('Error unlinking test:', err);
      alert('Failed to unlink test');
    }
  };
  

  return (
    <div className="w-full max-w-3xl mx-auto bg-[#1f1f1f] p-6 rounded-lg shadow-lg text-white">
      {!fixedChapterId && (
  <div className="mb-4">
    <label className="block mb-1 text-sm">Select Chapter</label>
    <select
      value={selectedChapterId}
      onChange={(e) => setSelectedChapterId(e.target.value)}
      className="w-full p-2 bg-[#2a2a2a] rounded"
    >
      <option value="">-- Select --</option>
      {chapters.map((ch) => (
        <option key={ch._id} value={ch._id}>
          {ch.name}
        </option>
      ))}
    </select>
  </div>
)}


{selectedChapterId && (
  <>
    {linkedTestId ? (
      <div className="mt-6 border-t border-gray-600 pt-4">
        <h3 className="text-lg mb-2 text-green-400">Linked Test:</h3>
        <p className="mb-2 text-white text-sm">
  {tests.find((t) => t._id === linkedTestId)?.title || 'Loading...'}
</p>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setPreviewId(linkedTestId)}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded text-sm"
          >
            👁 Preview
          </button>
          <button
            onClick={handleDownload}
            className="px-3 py-1 bg-yellow-600 hover:bg-yellow-500 rounded text-sm"
          >
            ⤓ Download
          </button>
          <button
            onClick={handleUnlinkTest}
            className="px-3 py-1 bg-red-600 hover:bg-red-500 rounded text-sm"
          >
            ❌ Unlink
          </button>
        </div>
      </div>
    ) : (
      <>
        <div className="mb-4">
          <label className="block mb-1 text-sm">Select Test</label>
          <select
            value={selectedTestId}
            onChange={(e) => setSelectedTestId(e.target.value)}
            className="w-full p-2 bg-[#2a2a2a] rounded"
          >
            <option value="">-- Select --</option>
            {tests.map((test) => (
              <option key={test._id} value={test._id}>
                {test.title}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={handleLinkTest}
          className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded shadow"
        >
          Link Selected Test
        </button>
      </>
    )}
  </>
)}



     

      <TestPreviewModal
        isOpen={!!previewId}
        onClose={() => setPreviewId(null)}
        testId={previewId}
      />
    </div>
  );
}

export default LinkTest;




//ye kam to ho gya h bhai ab sun ab ye problem h:--> mne addchapterform.jsx m chapter 1 se ek test link krke fr set dependencies button click krke usme chapter1 click kiya to uske liye chapter 2 and chapter 3 option m dikh rhe hn jo ki shi h. but jab mne chapter 2 se test link kiya and fr set dependencies button k content m chapter 2 ko select kiya to usse aage wala chapter 3 mujhe show nhi ho  rha h ,dependency set krne k liye(second snip dekh)