import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../config';
import TestPreviewModal from '../../components/TestModals/TestPreviewModal';

const LinkTestSection = ({ trainingId, chapterId }) => {
  const [tests, setTests] = useState([]);
  const [selectedTestId, setSelectedTestId] = useState('');
  const [linkedTestId, setLinkedTestId] = useState('');
  const [previewId, setPreviewId] = useState(null);

  useEffect(() => {
    if (!trainingId || !chapterId) return;
    fetchTests();
  }, [trainingId, chapterId]);

  const fetchTests = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/admin/tests`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setTests(res.data);
    } catch (err) {
      console.error('Error fetching tests:', err);
    }
  };

  const handleLinkTest = async () => {
    try {
      await axios.put(
        `${API_BASE_URL}/api/admin/training/${trainingId}/chapter/${chapterId}/link-test`,
        { testId: selectedTestId },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      alert('Test linked successfully!');
      setLinkedTestId(selectedTestId);
    } catch (err) {
      console.error('Error linking test:', err);
      alert('Failed to link test');
    }
  };

  const handleUnlinkTest = async () => {
    try {
      await axios.put(
        `${API_BASE_URL}/api/admin/training/${trainingId}/chapter/${chapterId}/unlink-test`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      alert('Test unlinked successfully!');
      setLinkedTestId('');
    } catch (err) {
      console.error('Error unlinking test:', err);
      alert('Failed to unlink test');
    }
  };

  const handleDownload = async () => {
    try {
      const test = tests.find((t) => t._id === linkedTestId);
      const res = await axios.get(`${API_BASE_URL}/api/admin/test/${linkedTestId}/download`, {
        responseType: 'blob',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${test.title}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Download error', err);
      alert('Failed to download test file');
    }
  };

  return (
    <div className="text-white bg-[#1f1f1f] p-4 rounded-lg">
      <h3 className="text-lg font-bold mb-3 text-yellow-400">Link Test Section</h3>

      {!linkedTestId ? (
        <>
          <select
            value={selectedTestId}
            onChange={(e) => setSelectedTestId(e.target.value)}
            className="w-full mb-3 p-2 bg-[#2a2a2a] rounded"
          >
            <option value="">-- Select Test --</option>
            {tests.map((test) => (
              <option key={test._id} value={test._id}>
                {test.title}
              </option>
            ))}
          </select>
          <button
            onClick={handleLinkTest}
            className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded"
          >
            Link Selected Test
          </button>
        </>
      ) : (
        <div className="space-y-2">
          <p className="text-green-400 text-sm">✅ Test linked successfully.</p>
          <div className="flex gap-2">
            <button
              onClick={() => setPreviewId(linkedTestId)}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded text-sm"
            >
              👁 Preview
            </button>
            <button
              onClick={handleDownload}
              className="px-3 py-1 bg-yellow-600 hover:bg-yellow-500 rounded text-sm"
            >
              ⤓ Download
            </button>
            <button
              onClick={handleUnlinkTest}
              className="px-3 py-1 bg-red-600 hover:bg-red-500 rounded text-sm"
            >
              ❌ Unlink
            </button>
          </div>
        </div>
      )}

      <TestPreviewModal
        isOpen={!!previewId}
        onClose={() => setPreviewId(null)}
        testId={previewId}
      />
    </div>
  );
};

export default LinkTestSection;
