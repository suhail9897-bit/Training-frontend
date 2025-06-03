import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config";
import { GraduationCap } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import Home from "../pages/CandidateDashboardButtons/Home";
import TestAppear from "./CandidateDashboardButtons/TestAppear";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";






// ✅ Correct worker version match
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@2.12.313/build/pdf.worker.min.js`;

const CandidateDashboard = () => {
  const navigate = useNavigate();
  const [selectedView, setSelectedView] = useState("home"); // default is Home
  const [trainingSubView, setTrainingSubView] = useState("pdf");
  const [selectedTestId, setSelectedTestId] = useState(null);
  
  const [training, setTraining] = useState(null);
  const [selectedPdfUrl, setSelectedPdfUrl] = useState(null);
  const [selectedPage, setSelectedPage] = useState(1);
  const [numPages, setNumPages] = useState(null);

  const [openChapters, setOpenChapters] = useState({});
  const [openNodes, setOpenNodes] = useState({});
  
  const [selectedTraining, setSelectedTraining] = useState(null);
  
  



  const toggleNode = (key) => {
    setOpenNodes((prev) => ({ ...prev, [key]: !prev[key] }));
  };

 


  const RenderIndex = ({ data, level, path, pdfPath }) => {
    const key = path.join("-");

    return (
      <li className="ml-2">
        <div className="flex items-center gap-1">
          <button
            className="text-white"
            onClick={() => toggleNode(key)}
          >
            {openNodes[key] ? "▼" : "▶"}
          </button>
         <span
  className={`text-sm text-white ${
    selectedView !== "test" ? "hover:text-green-400 cursor-pointer" : "opacity-50 cursor-not-allowed"
  }`}
  onClick={() => {
    if (selectedView !== "test" && data.pageNo && pdfPath) {
      setSelectedPdfUrl(pdfPath);
      setSelectedPage(data.pageNo);
    }

    if (selectedView !== "test" && videoRef && data.videoStartTime !== undefined) {
      videoRef.currentTime = data.videoStartTime;
      videoRef.play();
    }
  }}
>
  {data.name}
</span>

        </div>

        {openNodes[key] && data.subIndexes?.length > 0 && (
          <ul className="ml-4 list-disc">
            {data.subIndexes.map((sub, idx) => (
              <RenderIndex
                key={sub._id || idx}
                data={sub}
                level={level + 1}
                path={[...path, idx]}
                pdfPath={pdfPath}
              />
            ))}
          </ul>
        )}
      </li>
    );
  };

  const [videoRef, setVideoRef] = useState(null);
  const [candidateName, setCandidateName] = useState("");
  const [candidateTestResults, setCandidateTestResults] = useState([]);
  


useEffect(() => {
  const fetchCandidateData = async () => {
    try {
      // Fetch assigned training
      const trainingRes = await axios.get(`${API_BASE_URL}/api/candidate/assigned-trainings`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      setTraining(trainingRes.data);

      // Fetch candidate name
      const nameRes = await axios.get(`${API_BASE_URL}/api/candidate/profile`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      setCandidateName(nameRes.data.name);
       setCandidateTestResults(nameRes.data.testResults || []);

    } catch (err) {
      console.error("Fetch error:", err);
      
    }
  };

  fetchCandidateData();
}, []);




  



  return (
    <div className="min-h-screen bg-[#0d1117] text-white flex flex-col">
     <header className="fixed top-0 left-0 w-full bg-gradient-to-r from-green-600 via-emerald-700 to-teal-600 p-4 shadow-lg flex justify-between items-center z-50">
 <div className="flex items-center space-x-3">
  <GraduationCap className="w-7 h-7 text-white drop-shadow-lg hover:scale-105 transition-transform duration-300" />
<button
  onClick={() => {
    setSelectedView("home");
    setSelectedTraining(null);
  }}
  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full shadow-lg backdrop-blur-md transition-all duration-300 border border-white/20 hover:scale-105"
>
  <span className="font-medium tracking-wide">Home</span>
</button>



</div>


  {/* ✅ Welcome message with candidate name */}
  <div className="flex items-center gap-4">
    <h1 className="text-sm text-white font-medium">
  Welcome <span className="text-gray-100">{candidateName || "Candidate"}</span>
</h1>

    <button
      onClick={() => {
        localStorage.clear();
        navigate("/login");
      }}
      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full shadow-md text-sm transition-all duration-200 ease-in-out"
    >
      Logout
    </button>
  </div>
</header>



      <div className="flex flex-1 pt-20">
         {selectedView === "home" && (
  <Home
    onSelectTraining={(training) => {
      setTraining(training);
      setSelectedView("training");
       setTrainingSubView("pdf"); 
    }}
  />
)}

  {selectedView === "training" && training && (
    <>
        
        {/* LEFT - Hierarchy */}
        <div className="w-1/5 border-r border-gray-600 p-4 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-3 text-green-400">Assigned Training</h2>
          <div className="bg-[#161b22] p-3 rounded text-sm text-gray-300">
            {training ? (
              <>
                <p>📘 {training.trainingTitle}</p>
                <ul className="ml-4 mt-2 list-disc list-inside">
                  {training.chapters?.map((chapter, cIdx) => (
                    <li key={cIdx}>
                      <div className="flex items-center gap-1">
                     <button
  className="text-white"
  disabled={selectedView === "test"}
  onClick={() =>
    setOpenChapters((prev) => ({
      ...prev,
      [cIdx]: !prev[cIdx],
    }))
  }
>

                          {openChapters[cIdx] ? "▼" : "▶"}
                        </button>
                        <span
  className={`text-white ${selectedView !== "test" ? "hover:text-green-400 cursor-pointer" : "opacity-50 cursor-not-allowed"}`}
  onClick={() => {
    if (selectedView !== "test" && chapter.pdf) {
      setSelectedPdfUrl(chapter.pdf);
      setSelectedPage(1); // default to first page
    }
  }}
>

                          {chapter.name}
                        </span>
                      </div>

                      {openChapters[cIdx] && (
                        <ul className="ml-4 list-disc">
                          {chapter.indexes?.map((topic, tIdx) => (
                            <RenderIndex
                              key={topic._id || tIdx}
                              data={topic}
                              level={0}
                              path={[cIdx, tIdx]}
                              pdfPath={chapter.pdf}
                            />
                          ))}
                        </ul>
                      )}

                     {chapter.linkedTestId && (() => {
  const passed = candidateTestResults.some(r =>
    r.testId === chapter.linkedTestId && r.status === "pass"
  );

  return passed ? (
    <div className="mt-2 ml-6 text-green-400 text-sm flex items-center gap-1">
      ✅ Test Completed
    </div>
  ) : (
    <button
      className="text-sm text-green-400 mt-2 ml-6 hover:underline"
      onClick={async () => {
        try {
          const res = await axios.get(`${API_BASE_URL}/api/candidate/${chapter.linkedTestId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });

          if (res.data.alreadyPassed) {
  toast.success("You have already passed this test.");
}
 else {
            setTrainingSubView("test");
            setSelectedTestId(chapter.linkedTestId);
          }
        } catch (err) {
          console.error("Failed to fetch test:", err);
          alert("Error fetching test details.");
        }
      }}
    >
      📄 Appear Test
    </button>
  );
})()}

                    </li>
                  ))}
                </ul>
               

              </>
            ) : (
              <p>Loading training...</p>
            )}
          </div>
        </div>


        

       { trainingSubView === "test" && selectedTestId ? (
  <div className="w-4/5 flex p-4 gap-6">
    <TestAppear testId={selectedTestId} setTrainingSubView={setTrainingSubView} />
  </div>
) : (
  <>
    {/* MIDDLE - PDF Viewer */}
    <div className="w-3/7 border-r border-gray-600 p-5 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-3 text-green-400">PDF Viewer</h2>
      {selectedPdfUrl ? (
        <div className="bg-[#161b22]  rounded">
          <Document
            file={selectedPdfUrl}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            onLoadError={(err) => console.error("PDF load error:", err)}
          >
            <Page pageNumber={selectedPage || 1} width={900} />
          </Document>

          <div className="flex justify-between items-center mt-4">
            <button
              className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50"
              disabled={selectedPage <= 1}
              onClick={() => setSelectedPage((prev) => prev - 1)}
            >
              Previous Page
            </button>
            <span className="text-sm text-gray-300">
              Page {selectedPage} of {numPages}
            </span>
            <button
              className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50"
              disabled={selectedPage >= numPages}
              onClick={() => setSelectedPage((prev) => prev + 1)}
            >
              Next Page
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-400">Select a topic to view PDF.</p>
      )}
    </div>

    {/* RIGHT - Video */}
    <div className="w-1/3 p-1">
      <h2 className="text-lg font-semibold mb-3 text-green-400">🎥 Video Player</h2>
      <div className="bg-[#161b22] h-[50vh] rounded text-gray-400">
        {training?.videoPath ? (
          <video
            controls
            ref={setVideoRef}
            className="h-full w-full object-contain rounded"
            src={training.videoPath}
          />
        ) : (
          <p className="text-center pt-8">No video found for this training.</p>
        )}
      </div>
    </div>
  </>
)}    

 </>
  )}
      </div>
      <ToastContainer />

    </div>
    
  );
};

export default CandidateDashboard;
