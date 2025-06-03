import { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "../../config";
import AddBatchForm from "../../components/BatchModals/addBatchform";
import DeleteBatchModal from "../../components/BatchModals/DeleteBatchModal";
import { Trash2 } from "lucide-react"; // for delete icon
import EditCandidates from "../../components/BatchModals/EditCandidates";




const Candidate = () => {
  const [batches, setBatches] = useState([]);
  const [showAddBatch, setShowAddBatch] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
const [batchToDelete, setBatchToDelete] = useState(null);
const [candidates, setCandidates] = useState([]);
const [viewMode, setViewMode] = useState("mandatory");
const [uploadedFiles, setUploadedFiles] = useState([]);
const [searchTerm, setSearchTerm] = useState("");
const [searchSuggestions, setSearchSuggestions] = useState([]);
const [currentPage, setCurrentPage] = useState(1);
const candidatesPerPage = 10;
const [editModalOpen, setEditModalOpen] = useState(false);
const [selectedCandidateForEdit, setSelectedCandidateForEdit] = useState(null);
const [trainings, setTrainings] = useState([]);
const [selectedTrainingId, setSelectedTrainingId] = useState("");
const [assignedTrainingTitle, setAssignedTrainingTitle] = useState(null);







const getColumnsToShow = () => {
  const all = [
    "name", "candidateId", "email", "password", "dob", "phone",
    "gender", "category", "disability", "typeOfDisability",
    "domicileState", "domicileDistrict", "educationLevel", "permanentAddress"
  ];
  const mandatory = ["name", "candidateId", "email", "password", "phone"];
  return viewMode === "mandatory" ? mandatory : all;
};

const indexOfLastCandidate = currentPage * candidatesPerPage;
const indexOfFirstCandidate = indexOfLastCandidate - candidatesPerPage;
const currentCandidates = candidates.slice(indexOfFirstCandidate, indexOfLastCandidate);

const totalPages = Math.ceil(candidates.length / candidatesPerPage);

const changePage = (page) => {
  if (page >= 1 && page <= totalPages) {
    setCurrentPage(page);
  }
};

const handleSearchInputChange = (e) => {
  setSearchTerm(e.target.value);
};





const handleExcelUpload = async (e) => {
  const file = e.target.files[0];
  if (!file || !selectedBatch) return;

  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await axios.post(
      `${API_BASE_URL}/api/admin/batch/${selectedBatch._id}/upload-candidates`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    alert("File uploaded successfully!");
    fetchUploadedFiles(selectedBatch._id);
    
  } catch (err) {
    console.error("Upload error:", err);
    const msg =
      err?.response?.data?.message ||
      "Failed to upload file.";
    alert(msg);
  } finally {
    // ✅ Always reset file input so same file can trigger onChange again
    e.target.value = "";
  }
};







  useEffect(() => {
    fetchBatches();
  }, []);

  useEffect(() => {
  const fetchTrainings = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/admin/trainings`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setTrainings(res.data);
    } catch (err) {
      console.error("Failed to fetch trainings:", err);
    }
  };

  fetchTrainings();
}, []);









  useEffect(() => {
  setCurrentPage(1);
}, [candidates]);

useEffect(() => {
  if (searchTerm.trim().length === 0 || !selectedBatch) {
    setSearchSuggestions([]);
    return;
  }

  const delayDebounce = setTimeout(async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/admin/candidates/search/${selectedBatch._id}?q=${searchTerm}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setSearchSuggestions(res.data);
    } catch (err) {
      console.error("Search failed:", err);
    }
  }, 400); // debounce

  return () => clearTimeout(delayDebounce);
}, [searchTerm, selectedBatch]);



 const fetchUploadedFiles = async (batchId) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/api/admin/batch/${batchId}/uploaded-files`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    setUploadedFiles(res.data);

    // ✅ New Logic: Check assigned training directly using route
    const assignedRes = await axios.get(`${API_BASE_URL}/api/admin/batch/${batchId}/assigned-training`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const trainingId = assignedRes.data.assignedTrainingId;

    if (trainingId) {
      const matched = trainings.find(t => t._id === trainingId);
      if (matched) {
        setAssignedTrainingTitle(matched.trainingTitle);
      } else {
        setAssignedTrainingTitle(null);
      }
    } else {
      setAssignedTrainingTitle(null);
    }

    // Load candidates of first file (optional)
    if (res.data.length > 0) {
      const fileId = res.data[0]._id;
      fetchCandidatesByFileId(fileId);
    } else {
      setCandidates([]);
    }

  } catch (err) {
    console.error("Failed to fetch uploaded files:", err);
  }
};




  const fetchBatches = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/admin/batches`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setBatches(res.data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)));

    } catch (err) {
      console.error("Failed to fetch batches:", err);
    }
  };





 const handleDeleteFile = async (fileId) => {
  if (!selectedBatch) return;

  try {
    await axios.delete(`${API_BASE_URL}/api/admin/batch/${selectedBatch._id}/file/${fileId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    alert("File deleted successfully!");

    fetchUploadedFiles(selectedBatch._id);

    // ✅ If currently viewed file is the one deleted, clear the list
    if (candidates.length && candidates[0]?.fileId === fileId) {
      setCandidates([]);
    }

  } catch (err) {
    console.error("File delete error:", err);
    alert("Failed to delete file.");
  }
};

const handleDownloadMergedExcel = async () => {
  if (!selectedBatch) return;

  try {
    const res = await axios.get(
      `${API_BASE_URL}/api/admin/batch/${selectedBatch._id}/merged-candidates`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        responseType: "blob", // important!
      }
    );

    const blob = new Blob([res.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Candidates_Batch_${selectedBatch.name}.xlsx`;
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error("Download failed:", err);
    alert("Failed to download merged Excel file.");
  }
};

const handleEditCandidate = (cand) => {
  setSelectedCandidateForEdit(cand);
  setEditModalOpen(true);
};

const handleCandidateUpdate = (updatedCandidate) => {
  setCandidates((prev) =>
    prev.map((c) => (c._id === updatedCandidate._id ? updatedCandidate : c))
  );
};





const handleDeleteCandidate = async (candidateId) => {
  if (!window.confirm("Are you sure you want to delete this candidate?")) return;

  try {
    await axios.delete(`${API_BASE_URL}/api/admin/batch/candidate/delete/${candidateId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    alert("Candidate deleted successfully!");
    // Refresh current file data
    if (candidates.length > 0) {
      fetchUploadedFiles(selectedBatch._id);
      setCandidates((prev) => prev.filter((c) => c._id !== candidateId));
    }
  } catch (err) {
    console.error("Delete failed:", err);
    alert("Failed to delete candidate.");
  }
};

const handleAccessCandidate = (cand) => {
  alert("Access (future):\n" + JSON.stringify(cand, null, 2));
};





const fetchCandidatesByFileId = async (fileId) => {
  if (!selectedBatch || !selectedBatch._id) return;

  try {
    const res = await axios.get(
      `${API_BASE_URL}/api/admin/candidates/${selectedBatch._id}/by-file/${fileId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    setCandidates(res.data);
  } catch (err) {
    console.error("Error fetching candidates by file:", err);
  }
};





const handleAssignTraining = async () => {
  if (!selectedTrainingId || !selectedBatch) {
    alert("Please select a training and a batch first.");
    return;
  }

  try {
    const res = await axios.post(
      `${API_BASE_URL}/api/admin/batch/assign-training`,
      {
        trainingId: selectedTrainingId,
        batchId: selectedBatch._id,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    alert("✅ Training assigned successfully to all batch candidates.");

     // 🧠 Instantly update assigned training UI
    const matched = trainings.find(t => t._id === selectedTrainingId);
    if (matched) {
      setAssignedTrainingTitle(matched.trainingTitle);
    }

    // Optionally clear dropdown
    setSelectedTrainingId("");
  } catch (err) {
    console.error("❌ Assign training failed:", err);
    alert("Failed to assign training.");
  }
};



const handleRemoveTraining = async () => {
  if (!selectedBatch || !assignedTrainingTitle) return;

  try {
    const trainingId = trainings.find(t => t.trainingTitle === assignedTrainingTitle)?._id;
    if (!trainingId) return alert("Training ID not found");

    const res = await axios.post(
      `${API_BASE_URL}/api/admin/batch/remove-training`,
      {
        trainingId,
        batchId: selectedBatch._id,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    alert("Training removed from all batch candidates.");

    // ✅ Immediately reset UI state
    // ✅ After successful removal
  // So button becomes enabled again


    setAssignedTrainingTitle(null);
    setSelectedTrainingId(""); // optional: to allow selecting same training again
    setCandidates([]); // optional: reset visible table
    await fetchUploadedFiles(selectedBatch._id); // ✅ force recheck candidates
  } catch (err) {
    console.error("❌ Remove training failed:", err);
    alert("Failed to remove training.");
  }
};

const handleRemoveFromBatch = async (candidateId) => {
  if (!selectedBatch || !candidateId) return;

  const confirm = window.confirm("Are you sure you want to remove this candidate from the selected batch?");
  if (!confirm) return;

  try {
    const res = await axios.put(
      `${API_BASE_URL}/api/admin/${selectedBatch._id}/remove-candidate/${candidateId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    alert("✅ Candidate removed from batch and training successfully!");
    fetchUploadedFiles(selectedBatch._id); // Refresh UI
  } catch (err) {
    console.error("❌ Remove from batch failed:", err);
    alert("Failed to remove candidate from batch.");
  }
};








  return (
    <div className="relative flex w-full h-full">
      {/* Sidebar with batch list */}
      <div className="w-1/5 bg-[#1e1e1e] p-4 flex flex-col ">
        <h2 className="text-lg font-bold text-gray-200 mb-4">Batches</h2>

        <button
          onClick={() => setShowAddBatch(true)}
          className="w-full bg-green-600 hover:bg-green-500 text-white py-2 rounded mb-4"
        >
          + Add Batch
        </button>

        <div className="space-y-2 overflow-y-auto pr-1" style={{ maxHeight: "175px" }}>

          {batches.map((batch) => (
            <div
              key={batch._id}
              onClick={() => {
  setSelectedBatch(batch);
  fetchUploadedFiles(batch._id);
}}
              
              className={`p-2 rounded cursor-pointer ${
                selectedBatch?._id === batch._id
                  ? "bg-green-800"
                  : "bg-[#2a2a2a]"
              } hover:bg-green-700 transition`}
            >
              <div className="flex justify-between items-center">
  <p className="text-sm font-medium">{batch.name}</p>
  <Trash2
    size={16}
    className="text-gray-200 hover:text-yellow-100 ml-2"
    onClick={(e) => {
      e.stopPropagation(); // prevent select
      setBatchToDelete(batch);
      setShowDeleteModal(true);
    }}
  />
</div>

            </div>
          ))}
        </div>
        {selectedBatch && (
  <div className="mt-6 border-t pt-4 border-gray-700 text-sm text-white">
    <p>
      <span className="font-semibold text-green-400">Selected:</span>{" "}
      {selectedBatch.name}
    </p>
    <p>
      Start Time:{" "}
      {new Date(selectedBatch.startTime).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      })}
    </p>
    <p>
      End Time:{" "}
      {new Date(selectedBatch.endTime).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      })}
    </p>
    {selectedBatch.description && (
  <p className="text-sm text-gray-300 mt-2 italic">📝 {selectedBatch.description}</p>
)}


    <div className="mt-4">
  <label className="bg-green-600 hover:bg-green-500 px-3 py-2 rounded cursor-pointer text-sm inline-block">
    📤 Upload Candidates Excel
    <input
      type="file"
      accept=".xlsx"
      onChange={(e) => handleExcelUpload(e)}
      className="hidden"
    />
  </label>
</div>


        <div className="mt-4">
      <p className="text-green-400 font-semibold mb-1">Uploaded Excel Files:</p>
      {uploadedFiles.length === 0 ? (
        <p className="text-gray-400 text-xs">No files uploaded yet.</p>
      ) : (
        <ul className="space-y-1">
          {uploadedFiles.map((file) => (
            <li key={file._id} className="flex justify-between items-center text-xs bg-[#2a2a2a] px-2 py-1 rounded">
              <span className="truncate">{file.originalname}</span>
              <span className="text-gray-400 ml-2 text-xs italic">
  ({file.candidateCount || 0} candidates)
</span>

             <div className="flex gap-2">
  <button
    className="text-green-400 hover:text-green-200"
    onClick={() => window.open(`${API_BASE_URL}/${file.path}`, "_blank")}
  >
    ⬇️
  </button>
  <button
    className="text-blue-400 hover:text-blue-200"
    onClick={() => fetchCandidatesByFileId(file._id)}
  >
    👁️
  </button>
  <button
    className="text-red-400 hover:text-red-200"
    onClick={() => handleDeleteFile(file._id)}
  >
    🗑️
  </button>
</div>

            </li>
          ))}
        </ul>
      )}

      <div className="mt-4">
  <button
    onClick={handleDownloadMergedExcel}
    className="bg-green-600 hover:bg-green-500 text-white text-xs px-3 py-2 rounded"
  >
    📥 Download All Candidates List
  </button>
  
</div>

<div className="mt-4">
  <label className="block text-sm text-green-300 mb-1">
    Assign Training to this Batch
  </label>
  <select
    value={selectedTrainingId}
    onChange={(e) => setSelectedTrainingId(e.target.value)}
    className="w-full bg-[#2a2a2a] text-white px-3 py-2 rounded border border-green-600"
    disabled={!!assignedTrainingTitle}
  >
    <option value="">-- Select Training --</option>
    {trainings.map((training) => (
      <option key={training._id} value={training._id}>
        {training.trainingTitle}
      </option>
    ))}
  </select>

  <button
    onClick={handleAssignTraining}
    disabled={!selectedTrainingId || assignedTrainingTitle}
    className={`mt-2 w-full px-4 py-2 rounded text-white ${
      selectedTrainingId && !assignedTrainingTitle
        ? "bg-green-600 hover:bg-green-700"
        : "bg-gray-600 cursor-not-allowed"
    }`}
  >
    ✅ Assign to Batch
  </button>

  {assignedTrainingTitle && (
    <>
      <p className="text-xs text-yellow-400 mt-2">
        Assigned Training: <span className="font-semibold">{assignedTrainingTitle}</span>
      </p>
      <button
        onClick={handleRemoveTraining}
        className="mt-2 w-full px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white"
      >
        ❌ Remove Assigned Training
      </button>
    </>
  )}
</div>



    </div>


    





  </div>
)}

      </div>

      {/* Right panel (placeholder for candidate list) */}
     <div className="w-3/4 p-4 text-white">
  {selectedBatch ? (
    <>
      <div className="flex justify-between items-center mb-4">
       

        <div className="flex gap-2">
          <button
            className={`px-3 py-1 rounded text-sm ${
              viewMode === "mandatory"
                ? "bg-green-700"
                : "bg-[#2a2a2a] hover:bg-green-800"
            }`}
            onClick={() => setViewMode("mandatory")}
          >
            Mandatory
          </button>
          <button
            className={`px-3 py-1 rounded text-sm ${
              viewMode === "optional"
                ? "bg-green-700"
                : "bg-[#2a2a2a] hover:bg-green-800"
            }`}
            onClick={() => setViewMode("optional")}
          >
            All
          </button>
        </div>
       <div className="relative w-64 ml-4">
  <input
    type="text"
    value={searchTerm}
    onChange={handleSearchInputChange}
    placeholder="Search candidate..."
    className="w-full px-3 py-1 text-sm bg-[#2a2a2a] text-white rounded border border-green-600 placeholder-gray-400 focus:outline-none focus:ring focus:ring-green-500 pr-8"
  />

  {searchTerm && (
    <button
      onClick={() => {
        setSearchTerm("");
        setSearchSuggestions([]);
        fetchUploadedFiles(selectedBatch._id); // reset view
        setCandidates([]); // clear view
      }}
      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-white text-xs"
    >
      ✕
    </button>
  )}

  {searchTerm && (
    <ul className="absolute bg-[#1e1e1e] text-white border border-green-600 rounded mt-1 max-h-48 overflow-y-auto z-50 w-full">
      {searchSuggestions.length > 0 ? (
        searchSuggestions.map((cand) => (
          <li
            key={cand._id}
            onClick={() => {
              setCandidates([cand]);
              setSearchTerm("");
              setSearchSuggestions([]);
              setCurrentPage(1);
            }}
            className="px-3 py-1 hover:bg-green-700 cursor-pointer text-sm"
          >
            {cand.name} ({cand.candidateId})
          </li>
        ))
      ) : (
        <li className="px-3 py-2 text-sm text-red-400 italic">
          No results found
        </li>
      )}
    </ul>
  )}
</div>



      </div>

      {candidates.length > 0 ? (
        <div className="overflow-x-auto border border-[#444] rounded">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-[#2a2a2a] text-green-300">
              <tr>
                {getColumnsToShow().map((col) => (
                  <th key={col} className="px-4 py-2 border-b border-[#444]">
                    {col}
                  </th>
                ))}
                <th className="px-4 py-2 border-b border-[#444]">Action</th>

              </tr>
            </thead>
            <tbody>
              {currentCandidates.map((cand, idx) => (
                <tr key={idx} className="hover:bg-[#222]">
                  {getColumnsToShow().map((col) => (
                    <td key={col} className="px-4 py-1 border-b border-[#333]">
                      {cand[col] && cand[col].toString().trim() !== "" ? cand[col] : "-"}

                    </td>
                  ))}
                  <td className="px-4 py-1 border-b border-[#333] whitespace-nowrap text-xs">
  <button
    onClick={() => handleEditCandidate(cand)}
    className="text-blue-400 hover:text-blue-200 mr-2"
  >
    ✏️
  </button>
  <button
    onClick={() => handleDeleteCandidate(cand._id)}
    className="text-red-400 hover:text-red-200 mr-2"
  >
    🗑️
  </button>
  <button
  onClick={() => handleRemoveFromBatch(cand._id)}
  className="ml-2 text-red-500 hover:text-red-700 text-lg font-bold"
>
  ✖
</button>

</td>

                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-center items-center gap-2 py-4 text-sm">
  <button
    onClick={() => changePage(currentPage - 1)}
    disabled={currentPage === 1}
    className={`px-2 py-1 rounded ${currentPage === 1 ? "bg-gray-500 cursor-not-allowed" : "bg-green-700 hover:bg-green-600"} text-white`}
  >
    ⬅ Prev
  </button>

  {[...Array(totalPages)].map((_, i) => (
    <button
      key={i + 1}
      onClick={() => changePage(i + 1)}
      className={`px-2 py-1 rounded ${currentPage === i + 1 ? "bg-green-800" : "bg-[#2a2a2a] hover:bg-green-700"} text-white`}
    >
      {i + 1}
    </button>
  ))}

  <button
    onClick={() => changePage(currentPage + 1)}
    disabled={currentPage === totalPages}
    className={`px-2 py-1 rounded ${currentPage === totalPages ? "bg-gray-500 cursor-not-allowed" : "bg-green-700 hover:bg-green-600"} text-white`}
  >
    Next ➡
  </button>
</div>

        </div>
      ) : (
        <p className="text-center text-gray-400">Please click on eye icon on uploaded file.</p>
      )}
    </>
  ) : (
    <p className="text-center text-gray-500">Select a batch to view details.</p>
  )}
</div>


      {/* ⬇️ Pop-up modal rendered outside layout */}
      {showAddBatch && (
        <AddBatchForm
          onClose={() => setShowAddBatch(false)}
          onBatchAdded={fetchBatches}
        />
      )}

      {showDeleteModal && batchToDelete && (
  <DeleteBatchModal
    batch={batchToDelete}
    onClose={() => setShowDeleteModal(false)}
    onDeleted={() => {
      fetchBatches();
      setSelectedBatch(null);
      setShowDeleteModal(false);
    }}
  />
)}

{editModalOpen && selectedCandidateForEdit && (
  <EditCandidates
    candidate={selectedCandidateForEdit}
    onClose={() => setEditModalOpen(false)}
    onUpdated={handleCandidateUpdate}
  />
)}

    </div>
  );
};

export default Candidate;
