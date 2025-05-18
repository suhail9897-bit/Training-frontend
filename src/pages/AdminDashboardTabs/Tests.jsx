import { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "../../config";
import TestPreviewModal from "../../components/TestModals/TestPreviewModal";
import { ArrowPathIcon } from '@heroicons/react/24/outline';


function Tests({ onBack }) {
  const [file, setFile] = useState(null);
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [previewId, setPreviewId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  



  const fetchTests = async () => {
    try {
        setRefreshing(true); // start spinning
      const res = await axios.get(`${API_BASE_URL}/api/admin/tests`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setTests(res.data);
    } catch (err) {
      console.error("Error fetching tests:", err);
    }  finally {
        setRefreshing(false); // stop spinning
      }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  const handleUpload = async () => {
    if (!file) return alert("Please select a file first.");
    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/api/admin/upload-test`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Test uploaded successfully!");
      setFile(null);
      fetchTests();
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };


  const downloadExcel = async (id, title) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/admin/test/${id}/download`, {
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
  
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${title}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Download error", err);
      alert("Failed to download test file");
    }
  };
  

  return (
    <div className="w-full min-h-[calc(100vh-64px)] bg-[#121212] text-white p-6">
      <button
        onClick={onBack}
        className="mb-4 px-4 py-2 bg-red-600 hover:bg-red-500 rounded shadow"
      >
        ← Back
      </button>

      <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-4 bg-[#1e1e1e] p-4 rounded-lg shadow-md">

      <div className="flex items-center gap-2 bg-[#1f2937] text-sm rounded p-1.5">
  {file ? (
    <>
      <span className="text-white">{file.name}</span>
      <button
        onClick={() => setFile(null)}
        className="text-white hover:text-red-500 ml-2 font-bold text-lg"
        title="Remove file"
      >
        ×
      </button>
    </>
  ) : (
    <label className="text-white cursor-pointer">
      Choose File
      <input
        type="file"
        accept=".xlsx"
        onChange={(e) => setFile(e.target.files[0])}
        className="hidden"
      />
    </label>
  )}
</div>


        <button
          onClick={handleUpload}
          disabled={loading}
          className="px-5 py-2 bg-blue-600 hover:bg-blue-500 rounded shadow text-sm"
        >
          {loading ? "Uploading..." : "Upload New Test"}
        </button>
      </div>

      <div className="flex justify-between items-center mb-3">
  <h2 className="text-xl font-semibold">Uploaded Tests</h2>
  <button
  onClick={fetchTests}
  className={`p-2 bg-gradient-to-r from-blue-600 to-blue-700 
    hover:from-blue-500 hover:to-blue-600 
    active:scale-360 
    rounded-full shadow-md transition duration-600 ease-in-out 
    transform hover:scale-110`}
  title="Refresh List"
>
  <ArrowPathIcon className={`h-5 w-5 text-white ${refreshing ? 'animate-spin' : ''}`} />
</button>


</div>


      {tests.length === 0 ? (
        <p className="text-gray-400">No tests uploaded yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg ring-1 ring-[#333] shadow-xl">

          <table className="w-full text-sm text-left text-white border border-[#2d2d2d] rounded overflow-hidden shadow-lg">

          <thead className="bg-[#2c2c2c] text-green-400 text-sm uppercase tracking-wider  ">

  <tr>
    <th className="px-4 py-3">Test Name</th>
    <th className="px-4 py-3">Duration (min)</th>
    <th className="px-4 py-3">Total Questions</th>
    <th className="px-4 py-3">Randomized</th>
    <th className="px-4 py-3">Attachment</th>
    <th className="px-4 py-3">Action</th>
  </tr>
</thead>
<tbody>
  {tests.map((test) => (
    <tr
      key={test._id}
      className="bg-[#181818] border-t border-[#333] hover:bg-[#222] transition duration-200 ease-in-out">
      <td className="px-4 py-3 text-green-400 font-semibold tracking-wide">{test.title}</td>
      <td className="px-4 py-2 text-gray-100">{test.duration || 0} min</td>
      <td className="px-4 py-2 text-gray-100">{test.totalQuestionCount || 0}</td>
      <td className="px-4 py-2 text-gray-100">{test.randomizedQuestionCount || 0}</td>
      <td className="px-4 py-2 text-gray-300">
        <button
          onClick={() => downloadExcel(test._id, test.title)}
          className="text-white hover:text-green-400 text-lg mr-3 transition transform hover:scale-110"

          title="Download Excel File"
        >
          ⤓
        </button>
        <button
          onClick={() => setPreviewId(test._id)}
          title="Preview"
          className="text-white hover:text-green-400 text-lg mr-3 transition transform hover:scale-110"

        >
          👁
        </button>

                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={async () => {
                        if (window.confirm("Are you sure you want to delete this test?")) {
                          try {
                            await axios.delete(`${API_BASE_URL}/api/admin/test/${test._id}`, {
                              headers: {
                                Authorization: `Bearer ${localStorage.getItem("token")}`,
                              },
                            });
                            alert("Test deleted successfully");
                            fetchTests(); // refresh
                          } catch (err) {
                            console.error("Error deleting test:", err);
                            alert("Failed to delete test");
                          }
                        }
                      }}
                      className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded text-sm shadow-md transition hover:scale-105"

                    >
                      🗑
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <TestPreviewModal
  isOpen={!!previewId}
  onClose={() => setPreviewId(null)}
  testId={previewId}
/>

    </div>
  );
}

export default Tests;
