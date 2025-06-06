import { useFeedbackStore } from '../store/feedbackStore';
import React from 'react';

interface FeedbackItemProps {
  feedback: {
    id: string;
    text: string;
    likes: number;
    dislikes: number;
    category?: string;
  };
  onDelete: (id: string) => void;
  onEdit: (feedback: FeedbackItemProps['feedback']) => void;
}

const FeedbackItem = React.memo(function FeedbackItem({ feedback, onDelete, onEdit }: FeedbackItemProps) {
  const voteFeedback = useFeedbackStore((state) => state.voteFeedback);

  const currentLikes = useFeedbackStore(state => 
    state.feedbacks.find(item => item.id === feedback.id)?.likes ?? 0
  );
  const currentDislikes = useFeedbackStore(state => 
    state.feedbacks.find(item => item.id === feedback.id)?.dislikes ?? 0
  );

  const handleLike = () => {
    console.log(`FeedbackItem: Clicked Like for feedback ${feedback.id}`);
    voteFeedback(feedback.id, 'like');
  };

  const handleDislike = () => {
    console.log(`FeedbackItem: Clicked Dislike for feedback ${feedback.id}`);
    voteFeedback(feedback.id, 'dislike');
  };

  const handleDelete = () => {
    console.log(`FeedbackItem: Deleting feedback ${feedback.id}`);
    onDelete(feedback.id);
  };

  const handleEditClick = () => {
    console.log(`FeedbackItem: Editing feedback ${feedback.id}`, feedback);
    onEdit(feedback);
  };

  return (
    <div className="border p-4 rounded mb-2 flex justify-between items-center">
      <p className="flex-grow mr-4">{feedback.text}</p>
      <div className="flex items-center">
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded mr-1 flex items-center"
          onClick={handleLike}
        >
          👍 {currentLikes}
        </button>
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded mr-4 flex items-center"
          onClick={handleDislike}
        >
          👎 {currentDislikes}
        </button>
        <button
          className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded mr-1"
          onClick={handleEditClick}
        >
          Edit
        </button>
        <button
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-2 rounded"
          onClick={handleDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
});

export { FeedbackItem }; 