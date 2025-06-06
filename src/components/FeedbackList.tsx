import { FeedbackItem } from './FeedbackItem';

interface FeedbackListProps {
  feedbacks: { id: string; text: string; likes: number; dislikes: number; category?: string }[];
  onDelete: (id: string) => void;
  onEdit: (feedback: { id: string; text: string; likes: number; dislikes: number; category?: string }) => void;
}

function FeedbackList({ feedbacks, onDelete, onEdit }: FeedbackListProps) {
  return (
    <div className="mt-4">
      {feedbacks.map((feedback) => (
        <FeedbackItem key={feedback.id} feedback={feedback} onDelete={onDelete} onEdit={onEdit} />
      ))}
    </div>
  );
}

export { FeedbackList }; 