import { create } from 'zustand';
import { persist, devtools, StorageValue } from 'zustand/middleware';

interface Feedback {
  id: string;
  text: string;
  likes: number;
  dislikes: number;
  createdAt: number;
  category?: string; // Add category for Level 3
  userVote?: 'like' | 'dislike'; // Add to track user's vote status
}

type SortBy = 'date' | 'popularity';
type FilterBy = 'all' | string; // Allow filtering by category
type Theme = 'light' | 'dark'; // Add Theme type

interface FeedbackState {
  feedbacks: Feedback[];
  sortBy: SortBy;
  filterBy: FilterBy;
  theme: Theme; // Add theme state
  addFeedback: (text: string, category?: string) => void; // Update addFeedback to accept category
  deleteFeedback: (id: string) => void;
  voteFeedback: (id: string, type: 'like' | 'dislike') => void;
  editFeedback: (id: string, newText: string, newCategory?: string) => void;
  setSortBy: (sortBy: SortBy) => void;
  setFilterBy: (filterBy: FilterBy) => void;
  setTheme: (theme: Theme) => void; // Add setTheme action
  feedbackCount: number; // Derived state, but good to have in interface
  categories: string[]; // Add categories state
}

// Define the state subset to persist explicitly
interface PersistedState {
    feedbacks: Feedback[];
    sortBy: SortBy;
    filterBy: FilterBy;
    theme: Theme;
}

export const useFeedbackStore = create<FeedbackState>()(
  devtools(
    persist<FeedbackState, PersistedState>(
      (set) => ({
        feedbacks: [],
        sortBy: 'date',
        filterBy: 'all', // Default filter
        theme: 'light', // Default theme
        categories: ['UI', 'Performance', 'Feature', 'Other'], // Default categories

        addFeedback: (text, category) =>
          set((state) => {
            console.log('Store: Before adding feedback', state.feedbacks.length);
            const newFeedback: Feedback = {
              id: Date.now().toString(),
              text,
              likes: 0,
              dislikes: 0,
              createdAt: Date.now(),
              category: category || state.categories[0],
              userVote: undefined, // Initialize userVote
            };
            const updatedFeedbacks = [newFeedback, ...state.feedbacks];
            console.log('Store: After adding feedback', updatedFeedbacks.length);
            return { feedbacks: updatedFeedbacks };
          }),

        deleteFeedback: (id) =>
          set((state) => {
            console.log('Store: Before deleting feedback', state.feedbacks.length);
            const updatedFeedbacks = state.feedbacks.filter((feedback) => feedback.id !== id);
            console.log('Store: After deleting feedback', updatedFeedbacks.length);
            return { feedbacks: updatedFeedbacks };
          }),

        voteFeedback: (id, type) =>
          set((state) => {
            console.log('Store: Before voting', id, type, state.feedbacks.find(f => f.id === id)?.likes, state.feedbacks.find(f => f.id === id)?.dislikes);
            
            const updatedFeedbacks = state.feedbacks.map((feedback) => {
                if (feedback.id === id) {
                    let { likes, dislikes, userVote } = feedback;

                    if (type === 'like') {
                        if (userVote === 'like') {
                            // User unlikes
                            likes--;
                            userVote = undefined;
                        } else if (userVote === 'dislike') {
                            // User changes from dislike to like
                            dislikes--;
                            likes++;
                            userVote = 'like';
                        } else {
                            // User likes for the first time
                            likes++;
                            userVote = 'like';
                        }
                    } else if (type === 'dislike') {
                         if (userVote === 'dislike') {
                            // User undislikes
                            dislikes--;
                            userVote = undefined;
                        } else if (userVote === 'like') {
                            // User changes from like to dislike
                            likes--;
                            dislikes++;
                            userVote = 'dislike';
                        } else {
                            // User dislikes for the first time
                            dislikes++;
                            userVote = 'dislike';
                        }
                    }
                    
                    // Ensure counts don't go below zero
                    likes = Math.max(0, likes);
                    dislikes = Math.max(0, dislikes);

                    const updatedFeedback = { ...feedback, likes, dislikes, userVote };
                    console.log(`Store: Voting - Updated feedback ${id}:`, updatedFeedback);
                    return updatedFeedback;
                }
                return feedback;
            });

            console.log('Store: After voting - updated feedbacks array length:', updatedFeedbacks.length);
            const votedFeedback = updatedFeedbacks.find(f => f.id === id);
            console.log('Store: After voting - updated feedback state:', votedFeedback?.likes, votedFeedback?.dislikes, votedFeedback?.userVote);
            
            return { feedbacks: updatedFeedbacks };
          }),

        editFeedback: (id, newText, newCategory) =>
          set((state) => {
            console.log('Store: Before editing feedback', id, newText, newCategory);
            const updatedFeedbacks = state.feedbacks.map((feedback) =>
              feedback.id === id
                ? { ...feedback, text: newText, category: newCategory || feedback.category }
                : feedback
            );
             console.log('Store: After editing feedback', updatedFeedbacks.find(f => f.id === id)?.text, updatedFeedbacks.find(f => f.id === id)?.category);
            return { feedbacks: updatedFeedbacks };
          }),

        setSortBy: (sortBy) => {
            console.log('Store: Setting sortBy to', sortBy);
             set({ sortBy });
        },
        setFilterBy: (filterBy) => {
            console.log('Store: Setting filterBy to', filterBy);
            set({ filterBy });
        },
        setTheme: (theme) => {
            console.log('Store: Setting theme to', theme);
            set({ theme });
        },

        // Using a selector for feedbackCount in components is generally better
        // than having it as a getter in the store interface if it's purely derived state.
        // However, keeping it for now as it was in the interface.
        feedbackCount: 0, // Initialize derived state
      }),
      {
        name: 'feedback-storage', // name of the item in localStorage
        getStorage: () => localStorage, // Use getStorage
        partialize: (state) => ({
          feedbacks: state.feedbacks,
          sortBy: state.sortBy,
          filterBy: state.filterBy,
          theme: state.theme,
        }),
         // Add onHydrate and onStorageWrite for debugging persistence
        onHydrate: (state) => { 
            console.log('Persistence: Hydrating state from localStorage:', state);
            console.log('Persistence: Hydrated feedbacks count:', state.feedbacks?.length);
         },
        onStorageWrite: (state) => { 
            console.log('Persistence: Writing state to localStorage:', state);
            console.log('Persistence: Writing feedbacks count:', state.feedbacks?.length);
        }
      }
    )
  )
);

// Although feedbackCount is declared in the interface, its value is derived.
// Accessing it directly from the store state (e.g., useFeedbackStore.getState().feedbackCount)
// might not be reactive. Using a selector like useFeedbackStore(state => state.feedbacks.length)
// in components is the standard Zustand approach for derived state that should trigger re-renders.
// I've removed the getter from the store definition but kept the interface property.
// Components should use a selector for the count. 