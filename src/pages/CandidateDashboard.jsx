// src/pages/CandidateDashboard.jsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap } from "lucide-react";
import axios from "axios";
import API_BASE_URL from "../config";
import Home from "./CandidateDashboardButtons/Home";
import TrainingView from "./CandidateDashboardButtons/TrainingView";



const CandidateDashboard = () => {
  const navigate = useNavigate();

  const [candidateName, setCandidateName] = useState("Candidate");
  const [assignedTrainings, setAssignedTrainings] = useState([]);
  const [selectedView, setSelectedView] = useState("home");
  const [selectedTraining, setSelectedTraining] = useState(null);
  const [trainingSubView, setTrainingSubView] = useState("pdf");
  const [candidate, setCandidate] = useState(null);
  



  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/candidate/profile`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setCandidateName(res.data.name || "Candidate");
        setCandidate(res.data);

      } catch (err) {
        console.error("Failed to fetch profile", err);
        navigate("/login");
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="min-h-screen bg-[#0d1117] text-white flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full bg-gradient-to-r from-green-600 via-emerald-700 to-teal-600 p-4 shadow-lg flex justify-between items-center z-50">
        <div className="flex items-center gap-3">
  <GraduationCap className="w-7 h-7 text-white" />

  <button
    onClick={() => {
      setSelectedView("home");
      setSelectedTraining(null);
      setTrainingSubView("pdf");
    }}
    className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full shadow transition"
  >
    Home
  </button>

  <button
    onClick={() => alert("Schematic clicked")}
    className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full shadow transition"
  >
    Schematic
  </button>

  <button
    onClick={() => alert("Icurate clicked")}
    className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full shadow transition"
  >
    Icurate
  </button>
</div>


        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">Welcome, {candidateName}</span>
          <button
            onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 text-white rounded-full shadow text-sm"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Section */}
      <main className="pt-24 w-full min-h-screen bg-[#1d232a] overflow-x-hidden">

       {selectedView === "home" ? (
  <Home
    candidateName={candidateName}
    assignedTrainings={candidate?.assignedTrainings || []}
    onSelectTraining={(training) => {
      setSelectedTraining(training);
      setSelectedView("training");
      setTrainingSubView("pdf");
    }}
  />
) : (
  <TrainingView
    training={selectedTraining}
    trainingSubView={trainingSubView}
    setTrainingSubView={setTrainingSubView}
    candidate={candidate}
  />
)}


      </main>
    </div>
  );
};

export default CandidateDashboard;
