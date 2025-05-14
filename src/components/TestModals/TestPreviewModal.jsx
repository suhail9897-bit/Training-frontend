import { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../../config";

function TestPreviewModal({ isOpen, onClose, testId }) {
  const [questions, setQuestions] = useState([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    const fetchPreview = async () => {
      if (!isOpen || !testId) return;

      try {
        const res = await axios.get(`${API_BASE_URL}/api/admin/test/${testId}/preview`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setTitle(res.data.testTitle);
        setQuestions(res.data.questions);
      } catch (err) {
        console.error("Preview fetch error:", err);
      }
    };

    fetchPreview();
  }, [isOpen, testId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-[#1e293b] text-white rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative border border-grey-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-xl hover:text-red-500 transition transform hover:scale-125"
        >
          ×
        </button>
  
        <h2 className="text-3xl font-bold mb-6 text-center text-green-400 border-b pb-3">
          Test Preview: <span className="text-white">{title}</span>
        </h2>
  
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-green-800 rounded-lg overflow-hidden">
            <thead className="bg-green-900 text-green-300 text-sm uppercase">
              <tr>
                <th className="px-4 py-3 text-left">Question</th>
                <th className="px-4 py-3 text-left">A</th>
                <th className="px-4 py-3 text-left">B</th>
                <th className="px-4 py-3 text-left">C</th>
                <th className="px-4 py-3 text-left">D</th>
                <th className="px-4 py-3 text-left">Answer</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((q, index) => (
                <tr
                  key={index}
                  className={`border-t border-green-200 ${
                    index % 2 === 0 ? "bg-[#1f2937]" : "bg-[#111827]"
                  } hover:bg-[#2d3748] transition duration-150`}
                >
                  <td className="px-4 py-3">{q.Question}</td>
                  <td className="px-4 py-3">{q.A}</td>
                  <td className="px-4 py-3">{q.B}</td>
                  <td className="px-4 py-3">{q.C}</td>
                  <td className="px-4 py-3">{q.D}</td>
                  <td className="px-4 py-3 text-orange-200 font-semibold">{q.Answer}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
  
}

export default TestPreviewModal;
