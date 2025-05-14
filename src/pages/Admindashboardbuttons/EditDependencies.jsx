import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API_BASE_URL from '../../config';

const EditDependencies = ({ trainingId, chapters, chapterId, onBack }) => {
  const [futureChapters, setFutureChapters] = useState([]);
  const [unlockedChapterIds, setUnlockedChapterIds] = useState([]);
  const [linkedTestId, setLinkedTestId] = useState('');


  useEffect(() => {
    if (!chapters || !chapterId) return;
  
    const selected = chapters.find(ch => ch._id === chapterId);
  
    if (!selected?.linkedTestId) {
      setLinkedTestId('');
      setFutureChapters([]);  // ⛔ don't allow any dependency
      return;
    }
  
    setLinkedTestId(selected.linkedTestId);
  
    const future = [];
    let found = false;
    for (let ch of chapters) {
      if (found) future.push(ch);
      if (ch._id === chapterId) found = true;
    }
  
    setFutureChapters(future);
    fetchUnlocks(chapterId);
  }, [chapters, chapterId]);
  

  const fetchUnlocks = async (chapterId) => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/admin/training/${trainingId}/chapter/${chapterId}/unlocks`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setUnlockedChapterIds(res.data.unlocksChapters || []);
    } catch (err) {
      console.error('Error fetching unlocks:', err);
    }
  };

  const handleAdd = async (targetId) => {
    const updated = [...new Set([...unlockedChapterIds, targetId])];
    try {
      await axios.put(
        `${API_BASE_URL}/api/admin/training/${trainingId}/chapter/${chapterId}/set-unlocks`,
        { unlocksChapters: updated },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setUnlockedChapterIds(updated);
      toast.success("Chapter added to unlock list");
    } catch (err) {
      toast.error("Failed to add chapter");
    }
  };

  const handleRemove = async (targetId) => {
    const updated = unlockedChapterIds.filter(id => id !== targetId);
    try {
      await axios.put(
        `${API_BASE_URL}/api/admin/training/${trainingId}/chapter/${chapterId}/remove-unlocks`,
        { removeChapterIds: [targetId] },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setUnlockedChapterIds(updated);
      toast.success("Chapter removed from unlock list");
    } catch (err) {
      toast.error("Failed to remove chapter");
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-[#1f1f1f] p-6 rounded-lg shadow-lg text-white">
      <h2 className="text-xl font-semibold mb-4 text-green-400">Edit Chapter Dependencies</h2>

      {!linkedTestId ? (
  <p className="text-sm text-red-400">
    ❗ Please link a test to this chapter before setting dependencies.
  </p>
) : futureChapters.length === 0 ? (
  <p className="text-sm text-gray-400">No future chapters available.</p>
) : (
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {futureChapters.map((ch) => (
            <div key={ch._id} className="flex justify-between items-center bg-[#2a2a2a] px-3 py-2 rounded">
              <span>{ch.name}</span>
              <div className="space-x-2">
                <button
                  onClick={() => handleAdd(ch._id)}
                  disabled={unlockedChapterIds.includes(ch._id)}
                  className="px-2 py-1 text-sm rounded bg-green-600 hover:bg-green-500 disabled:bg-green-900"
                >
                  Add
                </button>
                <button
                  onClick={() => handleRemove(ch._id)}
                  disabled={!unlockedChapterIds.includes(ch._id)}
                  className="px-2 py-1 text-sm rounded bg-red-600 hover:bg-red-500 disabled:bg-gray-500"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={onBack}
        className="mt-6 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded shadow"
      >
        ← Back
      </button>

      <ToastContainer position="top-right" autoClose={2500} />
    </div>
  );
};

export default EditDependencies;
