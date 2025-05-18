import { useState } from "react";
import axios from "axios";
import API_BASE_URL from "../../config";



function AddTrainingForm({ onBack, refreshTrainings }) {
  const [formData, setFormData] = useState({
    trainingId: "",
    trainingTitle: "",
    description: "",
    category: "",
    duration: "",
    startTime: "",
    endTime: "",
  });
  const [videoFile, setVideoFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);



  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 

  const handleSubmit = async (e) => {
    e.preventDefault();

     // Validate time logic
  const start = new Date(formData.startTime);
  const end = new Date(formData.endTime);
  if (end <= start) {
    alert("End time must be greater than start time");
    

    return;
  }
  
    const data = new FormData();
    data.append("trainingId", formData.trainingId);
    data.append("trainingTitle", formData.trainingTitle);
    data.append("description", formData.description);
    data.append("category", formData.category);
    data.append("duration", formData.duration);
    data.append("startTime", formData.startTime);
    data.append("endTime", formData.endTime);
    if (videoFile) {
      data.append("video", videoFile);
    }
  
    try {
      await axios.post(`${API_BASE_URL}/api/admin/Add-Training`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });
      

      
      setFormData({
        trainingId: "",
        trainingTitle: "",
        description: "",
        category: "",
        duration: "",
        startTime: "",
        endTime: "",
      });
      setVideoFile(null);
      refreshTrainings();  // ✅ Refresh the list
      onBack();            // ✅ Return to Trainings page
    } catch (err) {
      console.error(err);
      

    }
  };
  

  return (
    
      <div className="w-full max-w-3xl">
        <button
          onClick={onBack}
          className="mb-2 self-start px-4 py-2 bg-red-700 hover:bg-red-600 text-white rounded shadow-md transition duration-300"
        >
          ← Back
        </button>
  
        <h2 className="text-3xl font-bold mb-8 text-center tracking-wide">Add New Training</h2>
  
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full"
        >
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-semibold tracking-wide">Training ID</label>
            <input
              type="text"
              name="trainingId"
              placeholder="Enter Training ID"
              value={formData.trainingId}
              onChange={handleChange}
              className="p-4 rounded-lg bg-[#111827] text-white placeholder-green-400 border border-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-inner transition duration-300"
              required
            />
          </div>
  
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-semibold tracking-wide">Training Title</label>
            <input
              type="text"
              name="trainingTitle"
              placeholder="Enter Training Title"
              value={formData.trainingTitle}
              onChange={handleChange}
              className="p-4 rounded-lg bg-[#111827] text-white placeholder-green-400 border border-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-inner transition duration-300"
              required
            />
          </div>
  
          <div className="flex flex-col">
  <label className="mb-1 text-sm font-semibold tracking-wide">Category</label>
  <select
    name="category"
    value={formData.category}
    onChange={handleChange}
    className="p-4 rounded-lg bg-[#111827] text-white border border-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-inner transition duration-300"
    required
  >
    <option value="">Select a category</option>
    <option value="Web Development">Web Development</option>
    <option value="AI">AI</option>
    <option value="VLSI">VLSI</option>
    <option value="DSA">DSA</option>
    <option value="Frontend">Frontend</option>
    <option value="Backend">Backend</option>
  </select>
</div>

  
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-semibold tracking-wide">Duration of Training (Minutes)</label>
            <input
              type="number"
              name="duration"
               min="1"
              step="1"
              placeholder="Enter Duration in Minutes"
              value={formData.duration}
              onChange={handleChange}
              onInput={(e) => {
                e.target.value = e.target.value.replace(/\D/g, ''); // ✅ allow only digits
              }}
              className="p-4 rounded-lg bg-[#111827] text-white placeholder-green-400 border border-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-inner transition duration-300"
              required
            />
          </div>
  
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-semibold tracking-wide">Course Start Time</label>
            <input
              type="datetime-local"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              className="p-4 rounded-lg bg-[#111827] text-white border border-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-inner transition duration-300 [color-scheme:dark]"
              required
            />
          </div>
  
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-semibold tracking-wide">Course End Time</label>
            <input
              type="datetime-local"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              min={formData.startTime}
              className="p-4 rounded-lg bg-[#111827] text-white border border-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-inner transition duration-300 [color-scheme:dark]"
              required
            />
          </div>
  
          <div className="flex flex-col md:col-span-2">
            <label className="mb-1 text-sm font-semibold tracking-wide">Description</label>
            <textarea
              name="description"
              placeholder="Enter Description"
              value={formData.description}
              onChange={handleChange}
              className="p-4 rounded-lg bg-[#111827] text-white placeholder-green-400 border border-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-inner transition duration-300"
              required
            ></textarea>
          </div>
  
          <div className="flex flex-col md:col-span-2">
            <label className="mb-1 text-sm font-semibold tracking-wide">Upload Training Video</label>
            {!videoFile ? (
  <input
    type="file"
    accept="video/*"
    onChange={(e) => setVideoFile(e.target.files[0])}
    className="p-2 rounded-lg bg-[#111827] text-white border border-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-inner transition duration-300"
  />
) : (
  <div className="flex items-center justify-between bg-[#111827] text-white px-4 py-2 rounded border border-green-700">
    <span className="truncate">{videoFile.name}</span>
    <button
      type="button"
      onClick={() => setVideoFile(null)}
      className="ml-4 text-red-500 hover:text-red-400 text-xl font-bold"
      title="Remove"
    >
      &times;
    </button>
  </div>
)}

            {uploadProgress > 0 && (
  <div className="w-full bg-gray-700 rounded mt-2">
    <div
      className="bg-green-500 text-xs font-bold text-center py-1 rounded"
      style={{ width: `${uploadProgress}%` }}
    >
      {uploadProgress}%
    </div>
  </div>
)}

          </div>
  
          <div className="md:col-span-2 flex justify-center">
  <button
    type="submit"
    className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white rounded-md shadow-md transition-all text-base font-semibold tracking-wide"
  >
    Save Training
  </button>
</div>

        </form>

        

      </div>
      
    
  );
  
  
  

}

export default AddTrainingForm;
