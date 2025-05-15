import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../config';

const SetDependenciesSection = ({ trainingId, chapterId }) => {
  const [chapters, setChapters] = useState([]);
  const [selectedDeps, setSelectedDeps] = useState([]);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    if (!trainingId || !chapterId) return;
    fetchEligibleChapters();
  }, [trainingId, chapterId]);

  const fetchEligibleChapters = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/admin/training/${trainingId}/chapters`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const filtered = res.data.chapters.filter(ch =>
        ch._id !== chapterId && ch.linkedTestId
      );
      setChapters(filtered);
    } catch (err) {
      console.error('Error fetching chapters:', err);
    }
  };

  const handleCheckboxChange = (id) => {
    if (disabled) return;
    setSelectedDeps((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    try {
      await axios.put(
        `${API_BASE_URL}/api/admin/training/${trainingId}/chapter/${chapterId}/dependent-on`,
        { dependencyChapterIds: selectedDeps },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      alert('Dependencies set successfully!');
      setDisabled(true); // 🔒 Disable UI after successful set
    } catch (err) {
      console.error('Error setting dependencies:', err);
      alert('Failed to set dependencies');
    }
  };

  return (
    <div className="text-white">
      <h3 className="text-lg font-bold mb-2 text-pink-400">Set Dependencies</h3>
      {chapters.length === 0 ? (
        <p className="text-sm text-gray-400">No eligible chapters with linked test found.</p>
      ) : (
        <div className="space-y-2">
          {chapters.map((ch) => (
            <label key={ch._id} className="flex items-center gap-2 bg-[#2a2a2a] p-2 rounded">
              <input
                type="checkbox"
                checked={selectedDeps.includes(ch._id)}
                onChange={() => handleCheckboxChange(ch._id)}
                disabled={disabled}
              />
              <span>{ch.name}</span>
            </label>
          ))}
          <button
            onClick={handleSubmit}
            disabled={disabled || selectedDeps.length === 0}
            className={`mt-3 px-4 py-2 rounded text-sm shadow ${disabled ? 'bg-gray-500' : 'bg-green-600 hover:bg-green-700'}`}
          >
            Save Dependencies
          </button>
        </div>
      )}
    </div>
  );
};

export default SetDependenciesSection;
