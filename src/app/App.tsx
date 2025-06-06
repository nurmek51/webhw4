import { useState, useEffect } from 'react';
import { useFeedbackStore } from '../store/feedbackStore';
import { FeedbackForm } from '../components/FeedbackForm';
import { FeedbackList } from '../components/FeedbackList';
import { SortFilterControls } from '../components/SortFilterControls';
import { EditFeedbackModal } from '../components/EditFeedbackModal';
import { ThemeToggle } from '../components/ThemeToggle';
import './App.css';

interface Feedback {
  id: string;
  text: string;
  likes: number;
  dislikes: number;
  createdAt: number;
  category?: string;
}

function App() {
  // Use selectors for reactive state updates
  const feedbacks = useFeedbackStore((state) => state.feedbacks);
  const addFeedback = useFeedbackStore((state) => state.addFeedback);
  const deleteFeedback = useFeedbackStore((state) => state.deleteFeedback);
  const sortBy = useFeedbackStore((state) => state.sortBy);
  const filterBy = useFeedbackStore((state) => state.filterBy);
  const categories = useFeedbackStore((state) => state.categories);
  const theme = useFeedbackStore((state) => state.theme);
  const totalFeedbacksCount = useFeedbackStore((state) => state.feedbacks.length); // Reactive count

  // Apply theme class to documentElement
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // State for modal
  const [feedbackToEdit, setFeedbackToEdit] = useState<Feedback | null>(null);

  // Effect to control body overflow when modal is open
  useEffect(() => {
    if (feedbackToEdit) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to reset overflow when component unmounts or feedbackToEdit changes to null
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [feedbackToEdit]);

  const handleEdit = (feedback: Feedback) => {
    console.log('App: handleEdit called with feedback:', feedback);
    setFeedbackToEdit(feedback);
    // No need to set isEditModalOpen, modal renders based on feedbackToEdit !== null
  };

  const handleCloseModal = () => {
    console.log('App: handleCloseModal called');
    setFeedbackToEdit(null);
    // No need to set isEditModalOpen, modal renders based on feedbackToEdit === null
  };

  // We will pass the sorted and filtered feedbacks to FeedbackList
  const sortedAndFilteredFeedbacks = feedbacks
    .filter(feedback => {
      // Filtering logic (Level 3 - includes categories)
      return filterBy === 'all' || feedback.category === filterBy;
    })
    .sort((a, b) => {
      // Sorting logic based on sortBy state
      if (sortBy === 'date') {
        return b.createdAt - a.createdAt; // Newest first
      } else if (sortBy === 'popularity') {
        return (b.likes - b.dislikes) - (a.likes - a.dislikes); // Popularity based on likes - dislikes
      }
      return 0;
    });

    console.log('App: sortedAndFilteredFeedbacks before rendering FeedbackList:', sortedAndFilteredFeedbacks);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Product Feedback Board</h1>
        <ThemeToggle />
      </div>
      {/* Feedback count display */}
      <p className="mb-4">Total Feedbacks: {totalFeedbacksCount}</p> {/* Use reactive count */}
      <FeedbackForm onAdd={addFeedback} />
      <SortFilterControls />
      <FeedbackList feedbacks={sortedAndFilteredFeedbacks} onDelete={deleteFeedback} onEdit={handleEdit} />

      {/* Edit Feedback Modal */}
      <EditFeedbackModal
        onClose={handleCloseModal}
        feedback={feedbackToEdit}
      />
    </div>
  );
}

export default App;
