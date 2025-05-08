import { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../config';

function IndexButton({ onBack, trainingId, chapter }) {
  const [indexes, setIndexes] = useState([]);
  const [newIndex, setNewIndex] = useState({ name: '', pageNo: '' });
  const [loading, setLoading] = useState(false);
  const [showFormId, setShowFormId] = useState(null);
const [subIndexName, setSubIndexName] = useState('');
const [subIndexPageNo, setSubIndexPageNo] = useState('');
const [editingId, setEditingId] = useState(null);
const [editingName, setEditingName] = useState('');
const [editingPageNo, setEditingPageNo] = useState('');




  const fetchIndexes = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/admin/training/${trainingId}/chapter/${chapter._id}/index-list`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setIndexes(res.data.indexes || []);
    } catch (err) {
      console.error('Error fetching indexes:', err);
    }
  };

  const handleEditIndex = async (indexId) => {
   
  
    if (!newName || !newPageNo) {
      alert('Both fields required');
      return;
    }
  
    try {
      await axios.put(
        `${API_BASE_URL}/api/admin/training/${trainingId}/chapter/${chapter._id}/index/${indexId}`,
        { name: newName, pageNo: Number(newPageNo) },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );
      fetchIndexes();
      alert('Index updated');
    } catch (err) {
      console.error('Error updating index:', err);
      alert('Failed to update index');
    }
  };
  
  const handleDeleteIndex = async (indexId) => {
    if (!window.confirm('Are you sure you want to delete this index?')) return;
  
    try {
      await axios.delete(
        `${API_BASE_URL}/api/admin/training/${trainingId}/chapter/${chapter._id}/index/${indexId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );
      fetchIndexes();
      alert('Index deleted');
    } catch (err) {
      console.error('Error deleting index:', err);
      alert('Failed to delete index');
    }
  };
  
  const handleEditSubIndex = async (subIndexId) => {
   
  
    if (!newName || !newPageNo) {
      alert('Both fields required');
      return;
    }
  
    try {
      await axios.put(
        `${API_BASE_URL}/api/admin/training/${trainingId}/chapter/${chapter._id}/subindex/${subIndexId}`,
        { name: newName, pageNo: Number(newPageNo) },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );
      fetchIndexes();
      alert('SubIndex updated');
    } catch (err) {
      console.error('Error updating subindex:', err);
      alert('Failed to update subindex');
    }
  };
  
  const handleDeleteSubIndex = async (subIndexId) => {
    if (!window.confirm('Are you sure you want to delete this subindex?')) return;
  
    try {
      await axios.delete(
        `${API_BASE_URL}/api/admin/training/${trainingId}/chapter/${chapter._id}/subindex/${subIndexId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );
      fetchIndexes();
      alert('SubIndex deleted');
    } catch (err) {
      console.error('Error deleting subindex:', err);
      alert('Failed to delete subindex');
    }
  };
  


  const handleAddSubIndex = async (e, parentIndexId) => {
    e.preventDefault();
    try {
      await axios.post(
        `${API_BASE_URL}/api/admin/training/${trainingId}/chapter/${chapter._id}/add-subindex`,
        {
          parentIndexId: parentIndexId,
          name: subIndexName,
          pageNo: subIndexPageNo
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );
      setSubIndexName('');
      setSubIndexPageNo('');
      setShowFormId(null);
      fetchIndexes(); // refresh list
    } catch (err) {
      console.error('Error adding subIndex:', err);
    }
  };


  const handleSaveEdit = async (e, id, level) => {
    e.preventDefault();
  
    try {
      const endpoint =
        level === 'index'
          ? `${API_BASE_URL}/api/admin/training/${trainingId}/chapter/${chapter._id}/index/${id}`
          : `${API_BASE_URL}/api/admin/training/${trainingId}/chapter/${chapter._id}/subindex/${id}`;
  
      await axios.put(
        endpoint,
        { name: editingName, pageNo: Number(editingPageNo) },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
  
      fetchIndexes();
      setEditingId(null);
      alert(`${level === 'index' ? 'Index' : 'SubIndex'} updated`);
    } catch (err) {
      console.error(`Error updating ${level}:`, err);
      alert(`Failed to update ${level}`);
    }
  };
  


  const renderIndexes = (indexes, parentLevel = 'index') => (
    <ul className="pl-4">
      {indexes.map((idx) => (
        <li key={idx._id} className="bg-gradient-to-r from-gray-700 to-gray-900 rounded-lg mb-3 p-3 shadow-md hover:shadow-xl transition duration-300">
          <div className="flex items-center justify-between">

            <span>{idx.name} (Page {idx.pageNo})</span>
  
            <div className="flex items-center gap-2 ml-auto">
  <div className="flex gap-2">
              {parentLevel === 'index' ? (
                <>
                  <button
                    onClick={() => {
                        setEditingId(idx._id);
                        setEditingName(idx.name);
                        setEditingPageNo(idx.pageNo);
                      }}
                      
                    className="px-3 py-1 rounded text-xs bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 shadow-lg transition duration-300"

                  >
                    ✏ 
                  </button>
                  <button
                    onClick={() => handleDeleteIndex(idx._id)}
                    className="px-3 py-1 rounded text-xs bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 shadow-lg transition duration-300"

                  >
                    🗑 
                  </button>
                </>
              ) : (
                <>
                  <button
                      onClick={() => {
                        setEditingId(idx._id);
                        setEditingName(idx.name);
                        setEditingPageNo(idx.pageNo);
                      }}
                    className="px-3 py-1 rounded text-xs bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 shadow-lg transition duration-300"

                  >
                    ✏
                  </button>
                  <button
                    onClick={() => handleDeleteSubIndex(idx._id)}
                    className="px-3 py-1 rounded text-xs bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 shadow-lg transition duration-300"

                  >
                    🗑
                  </button>
                </>
              )}
            </div>
            {editingId === idx._id && (
  <form
    onSubmit={(e) => handleSaveEdit(e, idx._id, parentLevel)}
    className="mt-2 bg-gray-800 p-2 rounded"
  >
    <input
      type="text"
      value={editingName}
      onChange={(e) => setEditingName(e.target.value)}
      className="w-full mb-1 p-1 rounded bg-gray-700"
      placeholder="New name"
      required
    />
    <input
      type="number"
      value={editingPageNo}
      onChange={(e) => setEditingPageNo(e.target.value)}
      className="w-full mb-1 p-1 rounded bg-gray-700"
      placeholder="New page no"
      min="1"
      required
    />
    <button
      type="submit"
      className="px-4 py-1 bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 rounded shadow-lg text-sm transition duration-300"
    >
      Save
    </button>
    <button
      type="button"
      onClick={() => setEditingId(null)}
      className="ml-2 px-4 py-1 bg-gradient-to-r from-gray-500 to-gray-700 hover:from-gray-600 hover:to-gray-800 rounded shadow-lg text-sm transition duration-300"
    >
      Cancel
    </button>
  </form>
)}

  
            <button
              onClick={() =>
                setShowFormId(showFormId === idx._id ? null : idx._id)
              }
            className="px-3 py-1 rounded text-xs bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 shadow-lg transition duration-300"


            >
              ➕
            </button>
          </div>
          </div>
  
          {/* Form toggle */}
          {showFormId === idx._id && (
            <form
              onSubmit={(e) => handleAddSubIndex(e, idx._id)}
              className="mt-2 bg-[#1e1e1e] p-2 rounded"
            >
              <input
                type="text"
                placeholder="SubTopic Name"
                value={subIndexName}
                onChange={(e) => setSubIndexName(e.target.value)}
                className="w-full mb-1 p-1 rounded bg-[#2a2a2a]"
                required
              />
              <input
                type="number"
                placeholder="PDF Page No"
                min="1"
                value={subIndexPageNo}
                onChange={(e) => setSubIndexPageNo(e.target.value)}
                className="w-full mb-1 p-1 rounded bg-[#2a2a2a]"
                required
              />
              <button
                type="submit"
                className="px-4 py-1 bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 rounded shadow-lg text-sm transition duration-300"

              >
                Add SubIndex
              </button>
            </form>
          )}
  
          {/* Recursively render subIndexes */}
          {idx.subIndexes && idx.subIndexes.length > 0 &&
            renderIndexes(idx.subIndexes, 'subindex')}
        </li>
      ))}
    </ul>
  );
  
  

  useEffect(() => {
    fetchIndexes();
  }, [trainingId, chapter._id]);

  const handleAddIndex = async (e) => {
    e.preventDefault();
    if (!newIndex.name || !newIndex.pageNo) {
      alert('Please enter both topic name and page number');
      return;
    }
    try {
      setLoading(true);
      await axios.post(
        `${API_BASE_URL}/api/admin/training/${trainingId}/chapter/${chapter._id}/index`,
        newIndex,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setNewIndex({ name: '', pageNo: '' });  // reset form
      fetchIndexes();  // refresh list
    } catch (err) {
      console.error('Error adding index:', err);
      alert('Failed to add index');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 text-white">
     

     <h1 className="text-lg font-semibold mb-3">Indexes for {chapter.name}</h1>

{/* ✅ Add new index form (resized smaller) */}
<form onSubmit={handleAddIndex} className="mb-4 space-y-1">
  <input
    type="text"
    placeholder="Topic Name"
    value={newIndex.name}
    onChange={(e) => setNewIndex({ ...newIndex, name: e.target.value })}
    className="bg-[#2a2a2a] px-2 py-1 rounded w-full text-sm"
  />
  <input
    type="number"
    placeholder="Page Number"
    min="1"
    value={newIndex.pageNo}
    onChange={(e) => setNewIndex({ ...newIndex, pageNo: e.target.value })}
    className="bg-[#2a2a2a] px-2 py-1 rounded w-full text-sm"
  />
  <button
    type="submit"
    disabled={loading}
    className="px-3 py-1 bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 rounded shadow text-xs text-white transition duration-300"
  >
    {loading ? 'Adding...' : 'Add Topic'}
  </button>
</form>


      {/* ✅ Indexes list */}
      {indexes.length === 0 ? (
        <p>No indexes added yet.</p>
      ) : (
        renderIndexes(indexes)
      )}
    </div>
  );
}

export default IndexButton;
