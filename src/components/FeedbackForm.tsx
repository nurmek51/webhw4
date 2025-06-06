import { useState } from 'react';
import { useFeedbackStore } from '../store/feedbackStore';

interface FeedbackFormProps {
  onAdd: (text: string, category?: string) => void;
}

function FeedbackForm({ onAdd }: FeedbackFormProps) {
  const [text, setText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const categories = useFeedbackStore((state) => state.categories);

  useState(() => {
      if (categories.length > 0 && selectedCategory === '') {
          setSelectedCategory(categories[0]);
      }
  }, [categories]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      console.log('FeedbackForm: Submitting feedback', { text: text.trim(), category: selectedCategory });
      onAdd(text.trim(), selectedCategory);
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 flex flex-col sm:flex-row items-center">
      <input
        type="text"
        placeholder="Enter feedback here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="border p-2 rounded mr-0 sm:mr-2 mb-2 sm:mb-0 flex-grow"
        required
      />
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="border p-2 rounded mr-0 sm:mr-2 mb-2 sm:mb-0"
      >
        {categories.map((category) => (
          <option key={category} value={category}>{category}</option>
        ))}
      </select>
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Add Feedback
      </button>
    </form>
  );
}

export { FeedbackForm }; 