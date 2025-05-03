import { useState, useEffect } from "react";
import AddTrainingForm from "../Admindashboardbuttons/AddTrainingform";
import axios from "axios";
import DeleteTrainingModal from "../../components/TrainingTabModals/DeleteTrainingModal";
import EditTrainingModal from "../../components/TrainingTabModals/EditTrainingModal";
import Chapters from "../Admindashboardbuttons/Chapters";

function Trainings() {
  const [showForm, setShowForm] = useState(false);
  const [trainings, setTrainings] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showChapters, setShowChapters] = useState(false);

  




  useEffect(() => {
    fetchTrainings();
  }, []);

  const fetchTrainings = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/admin/trainings", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setTrainings(response.data);
    } catch (error) {
      console.error("Error fetching trainings:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/training/${selectedTraining._id}`, {
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
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white rounded-lg shadow-xl transition transform hover:scale-105"
            >
              Add Training
            </button>
          </div>
  
          <div className="overflow-x-auto w-full max-w-7xl shadow-lg rounded-lg bg-[#1a1a1a]">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-[#2c2c2c] text-green-400">
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Level</th>
                  <th className="py-3 px-4">Language</th>
                  <th className="py-3 px-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {trainings.map((training) => (
                  <tr key={training._id} className="border-b border-[#333] hover:bg-[#222] transition">
                    <td className="py-3 px-4">{training.name}</td>
                    <td className="py-3 px-4">{training.trainingTitle}</td>
                    <td className="py-3 px-4">{training.description}</td>
                    <td className="py-3 px-4">{training.category}</td>
                    <td className="py-3 px-4">{training.subject}</td>
                    <td className="py-3 px-4 capitalize">{training.level}</td>
                    <td className="py-3 px-4 capitalize">{training.language}</td>
                    <td className="py-3 px-4 flex gap-2">
                      <button
                        onClick={() => handleEditClick(training)}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded transition transform hover:scale-105"
                      >
                        Edit
                      </button>
  
                      <button
                        onClick={() => setShowChapters(true)}
                        className="px-3 py-1 bg-yellow-600 hover:bg-yellow-500 text-white rounded transition transform hover:scale-105"
                      >
                        Chapter
                      </button>
                      <button
                        onClick={() => {
                          setSelectedTraining(training);
                          setShowModal(true);
                        }}
                        className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded transition transform hover:scale-105"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
  
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
            trainingName={selectedTraining?.name}
          />
        </>
      ) : showForm ? (
        <AddTrainingForm onBack={() => setShowForm(false)} />
      ) : (
        <Chapters onBack={() => setShowChapters(false)} />
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
