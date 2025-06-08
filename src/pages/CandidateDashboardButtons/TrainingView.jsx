// src/pages/CandidateDashboardButtons/TrainingView.jsx

import React, {useEffect, useState, useRef } from "react";
import axios from "axios";
import { Document, Page, pdfjs } from "react-pdf";
import ReactPlayer from "react-player";
import { toast } from "react-toastify";
import API_BASE_URL from "../../config";


pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;



//main component
const TrainingView = ({ training, trainingSubView, setTrainingSubView, setActiveTestId, activeTestId}) => {
  const [selectedChapter, setSelectedChapter] = useState(training.chapters[0]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [pdfPage, setPdfPage] = useState(null);
  const [videoRange, setVideoRange] = useState({ start: 0, end: null });
  const [expandedIds, setExpandedIds] = useState(new Set());
  const [totalPages, setTotalPages] = useState(null);
  const videoRef = useRef(null);
  const playingRef = useRef(false);
const [, forceUpdate] = useState(0); // force re-render when needed (optional)

  const [testData, setTestData] = useState(null);
const [selectedAnswers, setSelectedAnswers] = useState({});
const [testLoading, setTestLoading] = useState(false);
const [timeLeft, setTimeLeft] = useState(null);




  const handleVideoProgress = ({ playedSeconds }) => {
  if (
    playingRef.current &&
videoRange.end !== null &&
playedSeconds >= videoRange.end

  ) {
    playingRef.current = false;
 // ⏸️ Auto-pause
  }
};




  const toggleExpand = (id) => {
    setExpandedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

const handleIndexClick = (indexObj) => {
  setSelectedIndex(indexObj);
  setPdfPage(indexObj.pageNo || 1);
  setVideoRange({
    start: indexObj.videoStartTime || 0,
    end: indexObj.videoEndTime || null,
  });
  setTrainingSubView("pdf");

  if (videoRef.current && indexObj.videoStartTime !== undefined) {
    videoRef.current.seekTo(indexObj.videoStartTime, "seconds");
    playingRef.current = true;
 // ✅ triggers autoplay
  }
};


//chapter lock k liye
const isChapterLocked = (chapter) => {
  return chapter.dependentChapters && chapter.dependentChapters.length > 0;
};

const getDependentChapterName = async (depChapterId) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/api/candidate/chapter-name/${depChapterId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res.data.name || "the required chapter";
  } catch (err) {
    console.error("Failed to fetch chapter name:", err);
    return "the required chapter";
  }
};



  const renderHierarchy = (items, level = 0) => {
    return items.map((item) => {
      const isExpanded = expandedIds.has(item._id);
      const hasChildren = item.indexes?.length > 0 || item.subIndexes?.length > 0;
      const children = item.indexes || item.subIndexes;

      return (
        <div key={`${item._id || item.name}-${level}`} className={`pl-${level * 4} mb-1`}>

          <div className="flex items-center gap-1">
            {hasChildren ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpand(item._id);
                }}
                className="text-green-300 text-sm"
              >
                {isExpanded ? "▼" : "▶"}
              </button>
            ) : (
              <span className="w-4 inline-block" />
            )}

           <div
  className={`cursor-pointer text-sm ${
    selectedIndex === item ? "text-yellow-400 font-semibold" : "text-green-300 hover:text-white"
  }`}
 onClick={async (e) => {

  e.stopPropagation();

  if (level === 0) {
    if (isChapterLocked(item)) {
  const firstDep = item.dependentChapters?.[0];
  const depName = await getDependentChapterName(firstDep);
  toast.warning(` First pass the test of "${depName}"`);
  return;
}

    setSelectedChapter(item);
  } else {
    handleIndexClick(item);
  }
}}

>
  {item.name}  
</div>


          </div>

          {isExpanded && (
            <div className="mt-1">
              {children?.length > 0 ? (
                renderHierarchy(children, level + 1)
              ) : (
                <p className="text-gray-500 text-xs pl-4">No topics are available.</p>
              )}
            </div>
          )}

          {level === 0 && item.linkedTestId && (
  <div className="pl-6">
   <button
 onClick={async () => {
  if (isChapterLocked(item)) return;

  try {
    const res = await axios.get(`${API_BASE_URL}/api/candidate/test/${item.linkedTestId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    setSelectedChapter(item);
    setTrainingSubView("test");
  } catch (err) {
    console.error("❌ Test status check error:", err);

    if (
      err.response?.status === 403 &&
      err.response?.data?.message === "You have already passed this test"
    ) {
      toast.success("✅ You have already passed this test");
    } else {
      toast.error("Failed to load test");
    }
  }
}}

  disabled={isChapterLocked(item)}
  className={`text-xs ${
    isChapterLocked(item)
      ? "text-gray-500 cursor-not-allowed"
      : "text-blue-400 hover:text-blue-200"
  }`}
>
  📘 Appear Test
</button>
  </div>
)}


        </div>
      );
    });
  };



  //fetch test useEffect
  useEffect(() => {
  const fetchTest = async () => {
    if (trainingSubView !== "test" || !selectedChapter?.linkedTestId) return;
    try {
      setTestLoading(true);
      const res = await axios.get(`${API_BASE_URL}/api/candidate/test/${selectedChapter.linkedTestId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setTestData(res.data);
    } catch (err) {
      console.error("❌ Test fetch error:", err);
      toast.error("Failed to load test");
    } finally {
      setTestLoading(false);
    }
  };

  fetchTest();
}, [trainingSubView, selectedChapter]);


//timer useEffect
const hasSubmittedRef = useRef(false); // ✅ NEW

useEffect(() => {
  if (trainingSubView !== "test" || !testData?.duration || testData?.finalResult) return;

  setTimeLeft(testData.duration * 60); // seconds
  hasSubmittedRef.current = false; // reset submission status

  let timerId = setInterval(() => {
    setTimeLeft((prev) => {
      if (prev <= 1) {
        clearInterval(timerId);

        // ✅ Prevent duplicate submission
        if (hasSubmittedRef.current) return 0;
        hasSubmittedRef.current = true;

        const answersPayload = testData.questions.map((q) => ({
          index: q.index,
          question: q.question,
          selectedOption: selectedAnswers[q.index] || null,
          options: q.options,
          correctAnswer: q.answer
        }));

        (async () => {
          try {
            const res = await axios.post(
              `${API_BASE_URL}/api/candidate/submit-test/${selectedChapter.linkedTestId}`,
              {
                answers: answersPayload,
                passingPercentage: testData.passingPercentage
              },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );

            toast.warn("⏰ Time's up! Your test has been auto-submitted.");
            toast.success(`✅ ${res.data.message}: ${res.data.result.status.toUpperCase()} (${res.data.result.scorePercentage.toFixed(1)}%)`);

            setTestData((prev) => ({
              ...prev,
              alreadyPassed: res.data.result.status === "pass",
               finalResult: res.data.result
            }));
          } catch (err) {
            console.error("❌ Auto-submit error:", err);
            toast.error("Auto-submit failed. Please try manually.");
          }
        })();
      }

      return prev - 1;
    });
  }, 1000);

  return () => clearInterval(timerId);
}, [trainingSubView, testData,selectedChapter?.linkedTestId]);



const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};




  return (
    <div className="flex w-full h-[calc(100vh-5rem)] px-2 gap-2 overflow-hidden">
      {/* Left Panel – Hierarchy */}
      <div className="w-[15%] bg-[#1a1f24] p-3 rounded-lg shadow overflow-y-auto">
        <h3 className="text-lg font-semibold mb-3 text-green-400">📚 Chapters</h3>
        {training.chapters?.length > 0 ? (
          renderHierarchy(training.chapters, 0)
        ) : (
          <p className="text-gray-400 text-sm">No chapters available.</p>
        )}
      </div>
      
      {trainingSubView === "test" && selectedChapter?.linkedTestId ? (
  <div className="w-[85%] bg-[#1d232a] rounded-lg shadow flex p-6 gap-6 text-white ">

    {/* Left: Questions */}
    <div className="w-[70%] h-[calc(100vh-7rem)] pr-4 overflow-y-auto custom-scrollbar">
       <h2 className="text-2xl font-bold text-green-400 mb-6 flex items-center gap-2">
      📝 <span className="text-white">Test Questions</span>
    </h2>
      {testLoading ? (
      <p className="text-sm">Loading test...</p>
    ) : testData?.questions?.length > 0 ? (
      testData.questions.map((q, i) => (
        <div key={i} className="mb-8 border-b border-gray-700 pb-4">
          <p className="mb-3 text-lg font-semibold text-blue-300">
            {q.index}. {q.question}
          </p>
          <div className="space-y-2">
            {q.options.map((opt, j) => (
              <label key={j} className="block ml-4 text-sm cursor-pointer hover:text-blue-300 transition">
                
               <input
  type="radio"
  name={`question-${q.index}`}
  value={opt}
  checked={selectedAnswers[q.index] === opt}
  onChange={() => {
    if (!testData?.finalResult) {
      setSelectedAnswers({ ...selectedAnswers, [q.index]: opt });
    }
  }}
  className="mr-2 accent-blue-500"
  disabled={!!testData?.finalResult} // ✅ Disable if result exists
/>
 {opt}
              </label>
            ))}

          </div>
        </div>
      ))
    ) : (
      <p className="text-gray-400">No questions available.</p>
    )}
  </div>

  {/* Right: Info Panel */}
  <div className="w-1/3 bg-[#1a1f24] p-6 rounded-2xl shadow-md border border-[#2a2f36]">

    <h2 className="text-xl font-bold mb-4 text-green-400 flex items-center gap-2">
      📊 <span className="text-white">Test Info</span>
    </h2>
    <div className="space-y-2 text-sm">
      <p><span className="text-gray-400">Title:</span> <span className="text-white font-medium">{testData?.title || "N/A"}</span></p>
      <p>
  <span className="text-gray-400">Time Left:</span>{" "}
  <span className="text-white font-medium">
    {formatTime(timeLeft || testData?.duration * 60)}
  </span>
</p>

      <p><span className="text-gray-400">Passing percentage:</span> <span className="text-white font-medium">{testData?.passingPercentage}%</span></p>

      {testData?.finalResult && (
  <div className="mt-4 space-y-2 border-t border-gray-700 pt-4">
    <p className="text-sm text-white">
      <span className="text-gray-400">Result:</span>{" "}
      <span
        className={`font-semibold ${
          testData.finalResult.status === "pass"
            ? "text-green-400"
            : "text-red-400"
        }`}
      >
        {testData.finalResult.status.toUpperCase()}
      </span>
    </p>
    <p className="text-sm text-white">
      <span className="text-gray-400">Percentage:</span>{" "}
      {testData.finalResult.scorePercentage.toFixed(1)}%
    </p>
    <p className="text-sm text-white">
      <span className="text-gray-400">Attempts:</span>{" "}
      {testData.finalResult.attemptCount}
    </p>

    {testData?.finalResult && (
  <button
    onClick={() => setTrainingSubView("pdf")}
    className="mt-4 w-full bg-gray-700 hover:bg-gray-600 text-white text-sm py-2 rounded transition"
  >
    🔙 Back to Training
  </button>
)}

  </div>
)}

     
    </div>

    {/*submiit logic starts here */}
    <button
  className="mt-6 w-full bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-500 hover:to-indigo-400 transition text-white font-bold py-2 px-4 rounded-lg shadow disabled:opacity-50 disabled:cursor-not-allowed"
  onClick={async () => {
    console.log(`Bearer ${localStorage.getItem("token")}`);
    console.log(selectedChapter.linkedTestId);
    if (!testData) return;

    const answersPayload = testData.questions.map((q) => ({
      index: q.index,
      question: q.question,
      selectedOption: selectedAnswers[q.index] || null,

      options: q.options,
      correctAnswer: q.answer
    }));

    try {
      console.log("🟡 Payload to Submit:", answersPayload);

      const res = await axios.post(
        `${API_BASE_URL}/api/candidate/submit-test/${selectedChapter.linkedTestId}`,
        {
          answers: answersPayload,
          passingPercentage: testData.passingPercentage
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success(`✅ ${res.data.message}: ${res.data.result.status.toUpperCase()} (${res.data.result.scorePercentage.toFixed(1)}%)`);

      setTestData((prev) => ({
        ...prev,
        alreadyPassed: res.data.result.status === "pass",
         finalResult: res.data.result 
      }));
    } catch (err) {
      console.error("❌ Submit error:", err);
      toast.error(err.response?.data?.message || "Failed to submit test");
    }
  }}
  disabled={!!testData?.finalResult}

>
  🚀 {testData?.alreadyPassed ? "Test Passed" : "Submit Test"}
</button>

{/*submit test logic and jsx ends here */}

  </div>
</div>
) : (

      <>
      {/* Middle Panel – PDF */}
      <div className="w-[55%] bg-[#1d232a] rounded-lg shadow flex flex-col items-center overflow-y-auto py-4 px-0">
        <h3 className="text-lg font-semibold mb-1 text-green-400">📄 PDF Viewer</h3>
        {selectedChapter?.pdf ? (
          <>
            <Document
              file={{ url: selectedChapter.pdf }}
              onLoadSuccess={({ numPages }) => {
                if (!pdfPage) setPdfPage(1);
                setTotalPages(numPages);
              }}
              onLoadError={(err) => console.error("PDF load error", err)}
            >
              <Page pageNumber={pdfPage || 1} width={850} />
            </Document>

            <div className="flex justify-between items-center w-full px-8 mt-4">
              <button
                className="bg-gray-700 hover:bg-gray-600 text-white text-sm px-4 py-2 rounded"
                onClick={() => setPdfPage((prev) => Math.max((prev || 1) - 1, 1))}
                disabled={pdfPage <= 1}
              >
                ⬅ Previous
              </button>
              <span className="text-sm text-gray-300">
                Page {pdfPage || 1} {totalPages ? `/ ${totalPages}` : ""}
              </span>
              <button
                className="bg-gray-700 hover:bg-gray-600 text-white text-sm px-4 py-2 rounded"
                onClick={() =>
                  setPdfPage((prev) =>
                    Math.min((prev || 1) + 1, totalPages || (prev || 1) + 1)
                  )
                }
                disabled={totalPages && pdfPage >= totalPages}
              >
                Next ➡
              </button>
            </div>
          </>
        ) : (
          <p className="text-gray-400 mt-4">No PDF available for this chapter.</p>
        )}
      </div>

      {/* Right Panel – Video */}
      <div className="w-[30%] bg-[#1d232a] p-1 rounded-lg shadow overflow-y-auto">
        <h3 className="text-lg font-semibold mb-0 text-green-400">🎥 Video Player</h3>
        {training.trainingId?.videoPath ? (
        <ReactPlayer
  ref={videoRef}
  url={training.trainingId?.videoPath}
  controls
  playing={playingRef.current}
  onPause={() => {
    if (playingRef.current !== false) {
      playingRef.current = false;
    }
  }}
  onPlay={() => {
    if (playingRef.current !== true) {
      playingRef.current = true;
    }
  }}
  onProgress={handleVideoProgress}
  width="100%"
  height="360px"
  config={{
    file: {
      attributes: {
        controlsList: "nodownload",
      },
    },
  }}
/>




        ) : (
          <p className="text-gray-400">No video available.</p>
        )}
      </div>
      </>
    )}
    </div>
  );
};

export default TrainingView;
