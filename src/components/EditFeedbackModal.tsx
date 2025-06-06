import React, { useState, useEffect } from 'react';
import { useFeedbackStore } from '../store/feedbackStore';

interface EditFeedbackModalProps {
  feedback: {
    id: string;
    text: string;
    category?: string;
  } | null;
  onClose: () => void;
}

const EditFeedbackModal: React.FC<EditFeedbackModalProps> = ({ feedback, onClose }) => {
  console.log('EditFeedbackModal: Rendering with feedback:', feedback);
  const [editText, setEditText] = useState(feedback?.text || '');
  const [editCategory, setEditCategory] = useState(feedback?.category || '');

  const { editFeedback, categories } = useFeedbackStore();

  // Update local state when feedback prop changes (e.g., opening modal with different feedback)
  useEffect(() => {
    setEditText(feedback?.text || '');
    setEditCategory(feedback?.category || '');
  }, [feedback]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (feedback) {
      editFeedback(feedback.id, editText, editCategory);
      onClose();
    }
  };

  if (!feedback) {
    return null; // Don't render if no feedback is being edited
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Edit Feedback</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="feedback-text">
              Feedback Text
            </label>
            <textarea
              id="feedback-text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-white dark:border-gray-600"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="feedback-category">
              Category
            </label>
            <select
              id="feedback-category"
              value={editCategory}
              onChange={(e) => setEditCategory(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-white dark:border-gray-600"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export { EditFeedbackModal }; 