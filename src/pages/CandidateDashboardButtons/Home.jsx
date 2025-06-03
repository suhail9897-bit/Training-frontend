import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../../config";

const Home = ({ onSelectTraining }) => {
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatDateTime = (isoString) => {
  return new Date(isoString).toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  });
};


  useEffect(() => {
    const fetchAssignedTrainings = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/candidate/assigned-trainings`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setTrainings(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load trainings", err);
        setLoading(false);
      }
    };

    fetchAssignedTrainings();
  }, []);

  return (
    <div className="w-full p-6 overflow-y-auto">
      <h2 className="text-2xl font-semibold mb-6 text-green-400">Your Assigned Trainings</h2>

      {loading ? (
        <p className="text-gray-400">Loading trainings...</p>
      ) : trainings.length === 0 ? (
        <p className="text-gray-400">No trainings assigned to you.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {trainings.map((training) => (
            <div
  key={training._id}
  onClick={() => onSelectTraining(training)}
  className="bg-gradient-to-br from-[#1c1f26] to-[#10141b] p-6 rounded-xl shadow-lg hover:shadow-xl border border-gray-700 transition-transform transform hover:scale-[1.03] cursor-pointer group"
>
  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-green-400 transition duration-200">
    {training.trainingTitle}
  </h3>

  <p className="text-gray-400 text-sm italic mb-2">{training.description || "No description"}</p>
  
  <div className="text-sm text-gray-300 space-y-1">
    <p><span className="text-gray-400 font-medium">Category:</span> {training.category || "N/A"}</p>
    <p><span className="text-gray-400 font-medium">Start Time:</span> {formatDateTime(training.startTime)}</p>
    <p><span className="text-gray-400 font-medium">End Time:</span> {formatDateTime(training.endTime)}</p>
  </div>

  <div className="mt-3">
    <span className="inline-block bg-green-600 bg-opacity-20 text-green-400 px-3 py-1 rounded-full text-xs font-semibold">
      ⏱ Duration: {training.duration || "N/A"} mins
    </span>
  </div>
</div>

          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
