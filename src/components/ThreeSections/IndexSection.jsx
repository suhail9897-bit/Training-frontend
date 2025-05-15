import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../config';

function secondsToTimeString(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function timeStringToSeconds(timeStr) {
  const parts = timeStr.split(':').map(Number);
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 1) return parts[0];
  return 0;
}

const IndexSection = ({ trainingId, chapterId }) => {
  const [chapter, setChapter] = useState({ name: '' });
  const [indexes, setIndexes] = useState([]);
  const [newIndex, setNewIndex] = useState({ name: '', pageNo: '', videoStartTime: '', videoEndTime: '' });
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
const [editingName, setEditingName] = useState('');
const [editingPageNo, setEditingPageNo] = useState('');
const [editingVideoStartTime, setEditingVideoStartTime] = useState('');
const [editingVideoEndTime, setEditingVideoEndTime] = useState('');
const [subIndex, setSubIndex] = useState({
    name: '', pageNo: '', videoStartTime: '', videoEndTime: '', parentId: null
  });
  


  const fetchChapterDetails = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/admin/training/${trainingId}/chapters`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const found = res.data.chapters.find(ch => ch._id === chapterId);
      if (found) setChapter(found);
    } catch (err) {
      console.error('Error loading chapter details', err);
    }
  };
  

  const fetchIndexes = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/admin/training/${trainingId}/chapter/${chapterId}/index-list`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setIndexes(res.data.indexes || []);
    } catch (err) {
      console.error('Error fetching indexes:', err);
    }
  };

  const handleAddIndex = async (e) => {
    e.preventDefault();
    if (!newIndex.name || !newIndex.pageNo) return alert('Please enter topic name and page number');

    const start = timeStringToSeconds(newIndex.videoStartTime);
    const end = timeStringToSeconds(newIndex.videoEndTime);
    if (end <= start) return alert('End time must be greater than start time');

    try {
      setLoading(true);
      await axios.post(`${API_BASE_URL}/api/admin/training/${trainingId}/chapter/${chapterId}/index`, {
        ...newIndex,
        videoStartTime: start,
        videoEndTime: end
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setNewIndex({ name: '', pageNo: '', videoStartTime: '', videoEndTime: '' });
      fetchIndexes();
    } catch (err) {
      console.error('Error adding index:', err);
      alert('Failed to add topic');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteIndex = async (indexId) => {
    if (!window.confirm('Delete this topic?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/admin/training/${trainingId}/chapter/${chapterId}/index/${indexId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      fetchIndexes();
    } catch (err) {
      console.error('Error deleting index:', err);
      alert('Failed to delete topic');
    }
  };

  useEffect(() => {
    if (trainingId && chapterId) {
      fetchChapterDetails();
      fetchIndexes();
    }
  }, [trainingId, chapterId]);

  const handleEditIndex = async (e, indexId) => {
    e.preventDefault();
    const start = timeStringToSeconds(editingVideoStartTime);
    const end = timeStringToSeconds(editingVideoEndTime);
    if (end <= start) return alert('End time must be greater than start time');
  
    try {
      await axios.put(`${API_BASE_URL}/api/admin/training/${trainingId}/chapter/${chapterId}/index/${indexId}`, {
        name: editingName,
        pageNo: Number(editingPageNo),
        videoStartTime: start,
        videoEndTime: end
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setEditingId(null);
      fetchIndexes();
    } catch (err) {
      console.error('Error editing index:', err);
      alert('Failed to update topic');
    }
  };

  const handleAddSubIndex = async (e, parentIndexId) => {
    e.preventDefault();
    const start = timeStringToSeconds(subIndex.videoStartTime);
    const end = timeStringToSeconds(subIndex.videoEndTime);
    if (end <= start) return alert('End time must be greater than start time');
    try {
      await axios.post(`${API_BASE_URL}/api/admin/training/${trainingId}/chapter/${chapterId}/add-subindex`, {
        parentIndexId,
        name: subIndex.name,
        pageNo: subIndex.pageNo,
        videoStartTime: start,
        videoEndTime: end
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setSubIndex({ name: '', pageNo: '', videoStartTime: '', videoEndTime: '', parentId: null });
      fetchIndexes();
    } catch (err) {
      console.error('Error adding subIndex:', err);
    }
  };
  

  //sub indexes material
  const renderIndexes = (indexes) => (
    <ul className="pl-4">
      {indexes.map((idx) => (
        <li key={idx._id} className="bg-[#2d2d2d] p-2 rounded mb-1">
          <div className="flex justify-between items-center">
            <div>
              <div className="font-semibold">{idx.name}</div>
              <div className="text-sm text-gray-400">
                Page {idx.pageNo} | ⏱ {secondsToTimeString(idx.videoStartTime)} → {secondsToTimeString(idx.videoEndTime)}
              </div>
            </div>
            <button
              onClick={() => setSubIndex({ ...subIndex, parentId: idx._id })}
              className="ml-2 px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs shadow"
            >
              ➕ 
            </button>
          </div>
  
          {/* Form to add nested subIndex */}
          {subIndex.parentId === idx._id && (
            <form onSubmit={(e) => handleAddSubIndex(e, idx._id)} className="mt-2 space-y-1">
              <input type="text" placeholder="SubTopic Name" value={subIndex.name}
                onChange={(e) => setSubIndex({ ...subIndex, name: e.target.value })}
                className="bg-[#3a3a3a] px-2 py-1 rounded w-full text-sm" required />
              <input type="number" placeholder="Page Number" value={subIndex.pageNo}
                onChange={(e) => setSubIndex({ ...subIndex, pageNo: e.target.value })}
                className="bg-[#3a3a3a] px-2 py-1 rounded w-full text-sm" />
              <input type="text" placeholder="Start Time" value={subIndex.videoStartTime}
                onChange={(e) => setSubIndex({ ...subIndex, videoStartTime: e.target.value })}
                className="bg-[#3a3a3a] px-2 py-1 rounded w-full text-sm" />
              <input type="text" placeholder="End Time" value={subIndex.videoEndTime}
                onChange={(e) => setSubIndex({ ...subIndex, videoEndTime: e.target.value })}
                className="bg-[#3a3a3a] px-2 py-1 rounded w-full text-sm" />
              <button type="submit" className="px-3 py-1 bg-green-600 rounded text-xs">Add</button>
            </form>
          )}
  
          {idx.subIndexes?.length > 0 && renderIndexes(idx.subIndexes)}
        </li>
      ))}
    </ul>
  );
  
  

  return (
    <div className="text-white">
      <h3 className="text-lg font-bold mb-2 text-blue-400">Index Section</h3>
      <p className="mb-2">{chapter.name && `Topics for: ${chapter.name}`}</p>
  
      <form onSubmit={handleAddIndex} className="mb-4 space-y-1">
        <input type="text" placeholder="Topic Name" value={newIndex.name}
          onChange={(e) => setNewIndex({ ...newIndex, name: e.target.value })}
          className="bg-[#2a2a2a] px-2 py-1 rounded w-full text-sm" required />
        <input type="number" placeholder="Page Number" min="1" value={newIndex.pageNo}
          onChange={(e) => setNewIndex({ ...newIndex, pageNo: e.target.value })}
          className="bg-[#2a2a2a] px-2 py-1 rounded w-full text-sm" required />
        <input type="text" placeholder="Video Start (HH:MM:SS)" value={newIndex.videoStartTime}
          onChange={(e) => setNewIndex({ ...newIndex, videoStartTime: e.target.value })}
          className="bg-[#2a2a2a] px-2 py-1 rounded w-full text-sm" />
        <input type="text" placeholder="Video End (HH:MM:SS)" value={newIndex.videoEndTime}
          onChange={(e) => setNewIndex({ ...newIndex, videoEndTime: e.target.value })}
          className="bg-[#2a2a2a] px-2 py-1 rounded w-full text-sm" />
        <button type="submit" disabled={loading}
          className="px-3 py-1 bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 rounded shadow text-xs">
          {loading ? 'Adding...' : 'Add Topic'}
        </button>
      </form>
  
      {indexes.length === 0 ? (
  <p className="text-sm text-gray-400">No topics added yet.</p>
) : (
  <ul className="space-y-2">
    {indexes.map(idx => (
      <li key={idx._id} className="bg-[#1e1e1e] p-2 rounded">
        <div className="flex justify-between items-center">
          <div className="w-full">
            {editingId === idx._id ? (
              <form onSubmit={(e) => handleEditIndex(e, idx._id)} className="space-y-1">
                <input type="text" value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  className="bg-[#2a2a2a] px-2 py-1 rounded w-full text-sm" required />
                <input type="number" value={editingPageNo}
                  onChange={(e) => setEditingPageNo(e.target.value)}
                  className="bg-[#2a2a2a] px-2 py-1 rounded w-full text-sm" required />
                <input type="text" value={editingVideoStartTime}
                  onChange={(e) => setEditingVideoStartTime(e.target.value)}
                  className="bg-[#2a2a2a] px-2 py-1 rounded w-full text-sm" />
                <input type="text" value={editingVideoEndTime}
                  onChange={(e) => setEditingVideoEndTime(e.target.value)}
                  className="bg-[#2a2a2a] px-2 py-1 rounded w-full text-sm" />
                <div className="flex gap-2 mt-1">
                  <button type="submit" className="px-2 py-1 bg-green-600 rounded text-xs">Save</button>
                  <button type="button" onClick={() => setEditingId(null)} className="px-2 py-1 bg-gray-600 rounded text-xs">Cancel</button>
                </div>
              </form>
            ) : (
              <>
                <div className="font-semibold">{idx.name}</div>
                <div className="text-sm text-gray-400">
                  Page {idx.pageNo} | ⏱ {secondsToTimeString(idx.videoStartTime)} → {secondsToTimeString(idx.videoEndTime)}
                </div>
              </>
            )}
          </div>

          {editingId !== idx._id && (
            <div className="flex gap-2 ml-2">
              <button
                onClick={() => {
                  setEditingId(idx._id);
                  setEditingName(idx.name);
                  setEditingPageNo(idx.pageNo);
                  setEditingVideoStartTime(secondsToTimeString(idx.videoStartTime || 0));
                  setEditingVideoEndTime(secondsToTimeString(idx.videoEndTime || 0));
                }}
                className="px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs">
                Edit
              </button>
              <button
                onClick={() => handleDeleteIndex(idx._id)}
                className="px-2 py-1 bg-red-600 hover:bg-red-700 rounded text-xs">
                Delete
              </button>
              <button
                onClick={() => setSubIndex({ ...subIndex, parentId: idx._id })}
                className="px-2 py-1 bg-indigo-600 hover:bg-indigo-700 rounded text-xs">
                ➕ 
              </button>
            </div>
          )}
        </div>

        {/* Add subindex form under this topic */}
        {subIndex.parentId === idx._id && (
          <form onSubmit={(e) => handleAddSubIndex(e, idx._id)} className="mt-2 space-y-1">
            <input type="text" placeholder="SubTopic Name" value={subIndex.name}
              onChange={(e) => setSubIndex({ ...subIndex, name: e.target.value })}
              className="bg-[#2a2a2a] px-2 py-1 rounded w-full text-sm" required />
            <input type="number" placeholder="Page Number" min="1" value={subIndex.pageNo}
              onChange={(e) => setSubIndex({ ...subIndex, pageNo: e.target.value })}
              className="bg-[#2a2a2a] px-2 py-1 rounded w-full text-sm" required />
            <input type="text" placeholder="Start Time (HH:MM:SS)" value={subIndex.videoStartTime}
              onChange={(e) => setSubIndex({ ...subIndex, videoStartTime: e.target.value })}
              className="bg-[#2a2a2a] px-2 py-1 rounded w-full text-sm" />
            <input type="text" placeholder="End Time (HH:MM:SS)" value={subIndex.videoEndTime}
              onChange={(e) => setSubIndex({ ...subIndex, videoEndTime: e.target.value })}
              className="bg-[#2a2a2a] px-2 py-1 rounded w-full text-sm" />
            <button type="submit" className="px-3 py-1 bg-green-600 rounded text-xs">Add</button>
          </form>
        )}

        {/* Recursive subindexes */}
        {idx.subIndexes && idx.subIndexes.length > 0 && (
          <ul className="mt-2 pl-4 border-l border-gray-600 space-y-2">
            {renderIndexes(idx.subIndexes)}
          </ul>
        )}
      </li>
    ))}
  </ul>
)}
</div>
  );

  
};

export default IndexSection;
