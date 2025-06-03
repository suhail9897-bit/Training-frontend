import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../../config";

function TestAppear({ testId, setTrainingSubView }) {
  const [testData, setTestData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [testSubmitted, setTestSubmitted] = useState(false);
const [resultData, setResultData] = useState(null);
const [attemptCount, setAttemptCount] = useState(1);



  

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/candidate/${testId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        
        setTestData(res.data);
        const localStored = JSON.parse(localStorage.getItem("localTestResults"));
if (localStored?.testId === (testId.testId || testId)) {
  setAttemptCount(localStored.attemptCount || 1);
}

        setTimeLeft(res.data.duration * 60); // convert minutes to seconds
      } catch (err) {
        console.error("Failed to fetch test:", err);
      }
    };

    fetchTest();
  }, [testId]);

  useEffect(() => {
    if (!timeLeft) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleOptionChange = (qIndex, selectedOption) => {
    setAnswers((prev) => ({ ...prev, [qIndex]: selectedOption }));
  };

  const allAnswered = testData?.questions?.length === Object.keys(answers).length;

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  // ✅ Detect timeout and fail test if not submitted
useEffect(() => {
  if (timeLeft === 0 && !testSubmitted) {
    setTestSubmitted(true);
    setResultData({
      scorePercentage: 0,
      status: "fail",
      timeout: true,
      answers: [] // this will show all boxes as wrong
    });
  }
}, [timeLeft, testSubmitted]);


  return (
    <div className="flex w-full h-full p-4 gap-4">
      {/* Left: Questions */}
      <div className="w-2/3 h-[80vh] overflow-y-auto space-y-6 bg-[#161b22] p-5 rounded shadow">

        <h2 className="text-xl font-semibold text-green-400 mb-4">📝 Appear Test</h2>
        {testData?.questions.map((q, index) => (
  <div key={index} className="mb-6 border-b pb-4 border-gray-600">
    <p className="text-white font-medium mb-2">{index + 1}. {q.question}</p>
    {q.options.map((opt, i) => (
              <label key={i} className="block text-sm text-gray-300 mb-1">
             <input
  type="radio"
  name={`q-${index}`}
  value={`${index}-${i}`}  // make value unique
  className="mr-2"
  checked={answers[index] === `${index}-${i}`}
  onChange={() => handleOptionChange(index, `${index}-${i}`)}
/>


                {opt}
              </label>
            ))}
          </div>
        ))}
      </div>

      {/* Right: Timer + Box List */}
      <div className="w-1/3 bg-[#1d1d1d] p-5 rounded shadow flex flex-col justify-between">
        <div>
            <button
  onClick={() => setTrainingSubView("pdf")}
  className="mb-4 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-all"
>
  🔙 Back to Training
</button>

          {!testSubmitted ? (
  <h3 className="text-green-400 text-lg font-semibold mb-4">🕒 Time Left: {formatTime(timeLeft)}</h3>
) : (
  <>
  <h3 className="text-lg font-semibold text-white mb-2">
    📊 Score: {resultData?.scorePercentage.toFixed(2)}%
  </h3>
  <h3 className={`text-lg font-bold mb-2 ${resultData?.status === 'pass' ? "text-green-400" : "text-red-400"}`}>
    {resultData?.status === 'pass' ? '✅ You have PASSED' : '❌ You have FAILED'}
  </h3>
  {resultData?.timeout && (
  <p className="text-yellow-400 mt-1 font-medium">
    ⏳ You are out of time.
  </p>
)}

  <p className="text-sm text-gray-300 mb-4">🧪 Attempts: {attemptCount}</p>

  {resultData?.status === 'fail' && (
    <button
      className="px-3 py-2 rounded bg-yellow-600 hover:bg-yellow-700 text-white font-semibold text-sm"
      onClick={async () => {
        try {
          const res = await axios.get(`${API_BASE_URL}/api/candidate/${testId.testId || testId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          setTestData(res.data);
          setAnswers({});
          setTimeLeft(res.data.duration * 60);
          setTestSubmitted(false);
          setResultData(null);
          setAttemptCount(prev => prev + 1);
        } catch (err) {
          console.error("Retry fetch failed:", err);
        }
      }}
    >
      🔁 Retry Test
    </button>
  )}
</>

)}

          <h4 className="text-yellow-400 text-md font-semibold mb-4">🎯 Passing Percentage: {testData?.passingPercentage || 0}%</h4>
          <div className="grid grid-cols-5 gap-2">
           {testData?.questions.map((_, idx) => {
  let boxClass = "bg-gray-700 text-gray-300";

  if (testSubmitted && resultData) {
    const selected = resultData.answers[idx]?.selectedOption;
    const correct = resultData.answers[idx]?.correctAnswer;
    boxClass = selected === correct ? "bg-green-600 text-white" : "bg-red-600 text-white";
  } else if (answers.hasOwnProperty(idx)) {
    boxClass = "bg-green-600 text-white";
  }

  return (
    <div
      key={idx}
      className={`w-10 h-10 flex items-center justify-center rounded font-bold text-sm ${boxClass}`}
    >
      {idx + 1}
    </div>
  );
})}

          </div>
        </div>

        <button
          disabled={!allAnswered || testSubmitted}

          className={`mt-6 py-2 w-full rounded text-white font-semibold transition-all duration-200 ${
  allAnswered && !testSubmitted ? "bg-green-500 hover:bg-green-600" : "bg-gray-600 cursor-not-allowed"
}`}

         onClick={async () => {
  if (Object.keys(answers).length !== testData?.questions?.length) return;

  try {
    const formattedAnswers = testData.questions.map((q, idx) => {
      const selectedIndex = parseInt(answers[idx]?.split("-")[1]);
      const selectedOption = ['A', 'B', 'C', 'D'][selectedIndex];
      return {
        question: q.question?.trim(),
        selectedOption: selectedOption?.trim(),
        correctAnswer: q.answer?.trim(),
        options: q.options
      };
    });

    const response = await axios.post(`${API_BASE_URL}/api/candidate/${testId.testId || testId}/submit`, {
      answers: formattedAnswers,
      passingPercentage: testData.passingPercentage
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });

    const result = response.data.result;
    setTestSubmitted(true);
    setResultData({ ...result, answers: formattedAnswers });
    if (result.status === "pass") {
  try {
    await axios.put(`${API_BASE_URL}/api/candidate/unlock-chapters/${testData.chapterId}`, {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  } catch (err) {
    console.error("❌ Unlock chapters error:", err);
  }
}


    localStorage.setItem("localTestResults", JSON.stringify({
      testId: testId.testId || testId,
      status: result.status,
      attemptCount
    }));

  } catch (err) {
    console.error("❌ Submit error:", err);
    alert("Error submitting test");
  }
}}




        >
          Submit Test
        </button>
      </div>
    </div>
  );
}

export default TestAppear;
