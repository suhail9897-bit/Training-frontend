import { useState, useEffect } from "react";
import AddTrainingForm from "../Admindashboardbuttons/AddTrainingform";
import axios from "axios";
import DeleteTrainingModal from "../../components/TrainingTabModals/DeleteTrainingModal";
import EditTrainingModal from "../../components/TrainingTabModals/EditTrainingModal";
import Chapters from "../Admindashboardbuttons/Chapters";
import API_BASE_URL from "../../config";
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { VideoCameraIcon } from '@heroicons/react/24/solid';



function Trainings() {
  const [showForm, setShowForm] = useState(false);
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showChapters, setShowChapters] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
const [selectedVideoUrl, setSelectedVideoUrl] = useState('');
const [selectedVideoName, setSelectedVideoName] = useState(''); // ✅ Add this



  




  useEffect(() => {
    fetchTrainings();
  }, []);

  const fetchTrainings = async () => {
    setLoading(true); // ✅ Start loading
    try {
      const response = await axios.get(`${API_BASE_URL}/api/admin/trainings`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setTrainings(response.data);
    } catch (error) {
      console.error("Error fetching trainings:", error);
    }
    setLoading(false); // ✅ End loading
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/api/admin/training/${selectedTraining._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setShowModal(false);
      setSelectedTraining(null); 
      fetchTrainings();
    } catch (error) {
      console.error("Error deleting training:", error);
    }
  };

  const handleEditClick = (training) => {
    setSelectedTraining(training);
    setShowEditModal(true);
  };


  return (
    <div className="flex flex-col items-center justify-start w-full min-h-[calc(100vh-64px)] bg-[#121212] text-white p-8">
  
      {!showForm && !showChapters ? (
        <>
          <div className="flex justify-between items-center w-full max-w-7xl mb-6">
  <h1 className="text-4xl font-extrabold tracking-wide">Trainings</h1>
  <div className="flex gap-3">
  <button
  onClick={fetchTrainings}
  disabled={loading}
  className={`p-3 ${
    loading ? 'opacity-50 cursor-not-allowed' : ''
  } bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-full shadow-xl transition transform hover:scale-110`}
>
  <ArrowPathIcon
    className={`h-6 w-6 text-white ${loading ? 'animate-spin' : ''}`}
  />
</button>


    <button
      onClick={() => setShowForm(true)}
      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-lg shadow-xl transition transform hover:scale-105"
    >
      Add Training
    </button>
  </div>
</div>

  
          <div className="overflow-x-auto w-full max-w-7xl shadow-lg rounded-lg bg-[#1a1a1a]">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-[#2c2c2c] text-green-400">
                  <th className="py-3 px-4">Training ID</th>
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Attachments</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {trainings.map((training) => (
                  <tr key={training._id} className="border-b border-[#333] hover:bg-[#222] transition">
                    <td className="py-3 px-4">{training.trainingId}</td>
                    <td className="py-3 px-4">{training.trainingTitle}</td>
                    <td className="py-3 px-4">{training.description}</td>
                   <td className="py-3 px-4">
  {training.videoPath ? (
    <button
      onClick={() => {
        setSelectedVideoUrl(training.videoPath); // ✅ FIXED LINE
        const fileName = training.videoPath.split('/').pop();
        setSelectedVideoName(fileName);
        setShowVideoModal(true);
      }}
      className="p-2 bg-yellow-500 hover:bg-yellow-400 text-black rounded-full shadow-md transition transform hover:scale-110"
    >
      <VideoCameraIcon className="h-5 w-5" />
    </button>
  ) : (
    <span className="text-gray-500">No Video</span>
  )}
</td>


                    <td className="py-3 px-4">{training.category}</td>
                    
                    <td className="py-3 px-4 flex gap-2">
                      <button
                        onClick={() => handleEditClick(training)}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded transition transform hover:scale-105"
                      >
                        ✏
                      </button>
  
                      <button
  onClick={() => {
    setSelectedTraining(training);   // 👈 store selected training
    setShowChapters(true);
  }}
  className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded transition transform hover:scale-105"
>
  Chapters
</button>

           <button
            onClick={() => {
            setSelectedTraining(training);
             setShowModal(true);
              }}
             className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded transition transform hover:scale-105"
              >
               🗑
           </button>
           </td>
            </tr>
            ))}
           </tbody>
            </table>

            {showVideoModal && (
  <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
    <div className="bg-[#1a1a1a] p-4 rounded-lg shadow-lg w-[90%] max-w-2xl">
      <div className="flex justify-between items-center mb-2">
      <h2 className="text-xl font-bold">
  Training Video <span className="text-sm text-gray-100 ml-2">({selectedVideoName})</span> {/* ✅ Added */}
</h2>

        <button
          onClick={() => setShowVideoModal(false)}
          className="text-white text-xl hover:text-red-500"
        >
          ×
        </button>
      </div>
      <video
  src={selectedVideoUrl}
  controls
  type="video/mp4"
  className="w-full rounded-lg"
  onError={() => console.error("❌ Video failed to load:", selectedVideoUrl)}
/>

    </div>
  </div>
)}

  
            {trainings.length === 0 && (
              <p className="text-center text-gray-400 py-6">
                No trainings available. Please add a training.
              </p>
            )}
          </div>
  
          {/* Delete Training Modal */}
          <DeleteTrainingModal
            show={showModal}
            onClose={() => setShowModal(false)}
            onConfirm={handleDelete}
            trainingId={selectedTraining?.trainingId}

          />
        </>
      ) : showForm ? (
        <AddTrainingForm onBack={() => setShowForm(false)}
        refreshTrainings={fetchTrainings} />
      ) : (
        <Chapters onBack={() => setShowChapters(false)} trainingId={selectedTraining?._id} />

      )}
  
      {showEditModal && (
        <EditTrainingModal
          training={selectedTraining}
          onClose={() => setShowEditModal(false)}
          onUpdate={fetchTrainings}
        />
      )}
      
    </div>
  );
  
}

export default Trainings;
