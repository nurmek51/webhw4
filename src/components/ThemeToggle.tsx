import { useFeedbackStore } from '../store/feedbackStore';

function ThemeToggle() {
  const theme = useFeedbackStore((state) => state.theme);
  const setTheme = useFeedbackStore((state) => state.setTheme);

  const handleToggle = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <button
      className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white transition-colors duration-200"
      onClick={handleToggle}
    >
      Switch to {theme === 'light' ? 'Dark' : 'Light'} Theme
    </button>
  );
}

export { ThemeToggle }; 