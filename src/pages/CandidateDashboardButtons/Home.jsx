// src/pages/CandidateDashboardButtons/Home.jsx

import React from "react";

const Home = ({ candidateName, assignedTrainings, onSelectTraining }) => {
  return (
    <div className="w-full px-6 pb-12">
      <h2 className="text-2xl font-semibold mb-6 text-green-400">
        Your Assigned Trainings
      </h2>

      {assignedTrainings.length === 0 ? (
        <p className="text-gray-400">No trainings assigned.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {assignedTrainings.map((item, idx) => {
            const t = item.trainingId;
            return (
              <div
                key={idx}
                onClick={() => onSelectTraining(item)}
                className="cursor-pointer bg-gradient-to-br from-[#1c1f26] to-[#10141b] p-6 rounded-xl shadow-lg hover:shadow-xl border border-gray-700 transition hover:scale-[1.03]"
              >
                <h3 className="text-xl font-semibold text-white mb-2">{t.trainingTitle}</h3>
                <p className="text-gray-400 text-sm italic mb-2">
                  {t.description || "No description"}
                </p>

                <div className="text-sm text-gray-300 space-y-1">
                  <p><span className="text-gray-400 font-medium">Category:</span> {t.category}</p>
                  <p><span className="text-gray-400 font-medium">Duration:</span> {t.duration} mins</p>
                  <p><span className="text-gray-400 font-medium">Start:</span> {new Date(t.startTime).toLocaleString()}</p>
                  <p><span className="text-gray-400 font-medium">End:</span> {new Date(t.endTime).toLocaleString()}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Home;
