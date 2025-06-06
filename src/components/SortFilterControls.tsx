import { useFeedbackStore } from '../store/feedbackStore';

function SortFilterControls() {
  const sortBy = useFeedbackStore((state) => state.sortBy);
  const setSortBy = useFeedbackStore((state) => state.setSortBy);
  const filterBy = useFeedbackStore((state) => state.filterBy);
  const setFilterBy = useFeedbackStore((state) => state.setFilterBy);
  const categories = useFeedbackStore((state) => state.categories);

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newSortBy = event.target.value as 'date' | 'popularity';
    console.log('SortFilterControls: Changing sort to', newSortBy);
    setSortBy(newSortBy);
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newFilterBy = event.target.value;
    console.log('SortFilterControls: Changing filter to', newFilterBy);
    setFilterBy(newFilterBy);
  };

  return (
    <div className="mb-4 flex items-center space-x-4">
      <div>
        <label htmlFor="sortBy" className="mr-2">Sort by:</label>
        <select
          id="sortBy"
          value={sortBy}
          onChange={handleSortChange}
          className="border p-1 rounded"
        >
          <option value="date">Date</option>
          <option value="popularity">Popularity</option>
        </select>
      </div>
      <div>
        <label htmlFor="filterBy" className="mr-2">Filter by:</label>
        <select
          id="filterBy"
          value={filterBy}
          onChange={handleFilterChange}
          className="border p-1 rounded"
        >
          <option value="all">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

export { SortFilterControls }; 