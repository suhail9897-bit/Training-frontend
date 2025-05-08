import { useEffect, useState } from 'react';
import AddchapterForm from './AddchapterForm';
import API_BASE_URL from "../../config";
import axios from 'axios';
import EditChapter from './EditChapter';
import DeleteChapterModal from '../../components/TrainingTabModals/DeleteChapterModal';
import IndexButton from './IndexButton';
import { ArrowPathIcon } from '@heroicons/react/24/outline';




function Chapters({ onBack, trainingId }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingChapter, setEditingChapter] = useState(null); 
  const [chapters, setChapters] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
const [chapterToDelete, setChapterToDelete] = useState(null);
const [showIndex, setShowIndex] = useState(false);



const fetchChapters = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/api/admin/training/${trainingId}/chapters`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    setChapters(res.data.chapters);
  } catch (err) {
    console.error('Failed to fetch chapters:', err);
  }
};

useEffect(() => {
  fetchChapters();
}, [trainingId]);

const handleDeleteChapter = async (chapterId) => {
  try {
    await axios.delete(`${API_BASE_URL}/api/admin/training/${trainingId}/chapter/${chapterId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    setShowDeleteModal(false);
    fetchChapters();  // ✅ list refresh
  } catch (err) {
    console.error('Error deleting chapter:', err);
    setShowDeleteModal(false);
  }
};
  
  



  return (

    showIndex ? (
      <IndexButton onBack={() => setShowIndex(false)} chapter={showIndex} trainingId={trainingId} />

    ) : (

    editingChapter ? (
      <EditChapter chapter={editingChapter} trainingId={trainingId} onBack={() => setEditingChapter(null)}  refreshChapters={fetchChapters} />

    ) : (
    
    
    <div className="flex flex-col items-start w-full min-h-[calc(100vh-64px)] bg-[#121212] text-white p-8">
      {!showAddForm && (
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 rounded-lg text-white shadow transition transform hover:scale-105 mb-6"
        >
          ← Back
        </button>
      )}
  
      {!showAddForm ? (
        <>
          <div className="flex justify-between items-center w-full mb-4">
            <h1 className="text-3xl font-bold">Chapters for Training</h1>
            <div className="flex gap-2">
            <button
  onClick={fetchChapters}
  className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-full shadow-xl transition transform hover:scale-110"
>
  <ArrowPathIcon className="h-6 w-6 text-white" />
</button>

            <button
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 rounded-lg text-white shadow transition transform hover:scale-105"
            >
              Add New Chapter
            </button>
          </div>
          </div>
  
          <div className="w-full overflow-x-auto rounded-lg shadow-lg">
            <table className="min-w-full bg-[#1e1e1e] rounded-lg overflow-hidden border border-gray-700">
              <thead className="bg-gradient-to-r from-[#2a2a2a] to-[#333] text-green-400 uppercase text-sm">
                <tr>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Description</th>
                  <th className="px-4 py-2 text-center">Attachment</th>
                  <th className="px-4 py-2 text-center">Mandatory</th>
                  <th className="px-4 py-2 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {chapters.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-6 text-gray-500">
                      No chapters found.
                    </td>
                  </tr>
                ) : (
                  chapters.map((chapter, index) => (
                    <tr
                      key={index}
                      className="hover:bg-[#2c2c2c] transition border-b border-gray-700"
                    >
                      <td className="px-4 py-3">{chapter.name}</td>
                      <td className="px-4 py-3">{chapter.description}</td>
                      <td className="px-4 py-3 text-center">
                        <a
                          href={`${API_BASE_URL}/uploads/${chapter.pdf}`}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:text-green-400 transition"
                        >
                          📥
                        </a>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {chapter.mandatory ? 'Yes' : 'No'}
                      </td>
                      <td className="px-4 py-3 flex justify-center gap-2">
                        <button
                          onClick={() => setEditingChapter(chapter)}
                         className="px-2 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-sm shadow transform hover:scale-105">
                          Edit
                        </button>
                       
                        
                        <button
    onClick={() => {
      setChapterToDelete(chapter._id);
      setShowDeleteModal(true);
    }}
    
    className="px-2 py-1 bg-red-600 hover:bg-red-500 text-white rounded text-sm shadow transform hover:scale-105"
  >
    🗑
  </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <AddchapterForm
          onBack={() => setShowAddForm(false)}
          trainingId={trainingId}
          chapters={chapters}
          refreshChapters={fetchChapters}
        />
      )}

  {/* ✅ Delete Modal ko return ke end me rakha */}
  <DeleteChapterModal
          isOpen={showDeleteModal}
          onConfirm={() => handleDeleteChapter(chapterToDelete)}
          onCancel={() => setShowDeleteModal(false)}
        />
      </div>
  ))

);
  
  

 
}

export default Chapters;
