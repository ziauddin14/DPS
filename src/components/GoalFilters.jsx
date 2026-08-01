import { Search, SlidersHorizontal } from 'lucide-react';
import { Input, Select, Button } from './ui';

const TYPE_OPTIONS = [
  { value: 'All', label: 'Type: All' },
  { value: 'Life', label: 'Life' },
  { value: '5 Years', label: '5 Years' },
  { value: '1 Year', label: '1 Year' },
  { value: '90 Days', label: '90 Days' },
  { value: 'Monthly', label: 'Monthly' },
  { value: 'Weekly', label: 'Weekly' },
  { value: 'Daily', label: 'Daily' },
];

const PRIORITY_OPTIONS = [
  { value: 'All', label: 'Priority: All' },
  { value: 'High', label: 'High' },
  { value: 'Medium', label: 'Medium' },
  { value: 'Low', label: 'Low' },
];

const STATUS_OPTIONS = [
  { value: 'All', label: 'Status: All' },
  { value: 'Not Started', label: 'Not Started' },
  { value: 'In Progress', label: 'In Progress' },
  { value: 'Completed', label: 'Completed' },
  { value: 'On Hold', label: 'On Hold' },
];

/**
 * GoalFilters component.
 * Renders controlled search input, goal type selection, priority selection, status selection, category selection, and a clear button.
 */
function GoalFilters({
  search,
  onSearchChange,
  type,
  onTypeChange,
  priority,
  onPriorityChange,
  status,
  onStatusChange,
  category,
  onCategoryChange,
  categories = [],
  onClearFilters,
}) {
  const categoryOptions = [
    { value: 'All', label: 'Category: All' },
    ...categories.map((cat) => ({ value: cat, label: cat })),
  ];

  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-4 sm:p-5 flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
      
      {/* Left: Search input */}
      <Input
        type="search"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search goals..."
        aria-label="Search goals"
        leftAddon={<Search className="w-5 h-5" aria-hidden="true" />}
        wrapperClassName="flex-1"
        className="w-full pl-11"
      />

      {/* Right: Dropdown Filters & Actions */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Decorative Filter icon */}
        <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider pr-1">
          <SlidersHorizontal className="w-4 h-4" aria-hidden="true" />
          <span>Filters</span>
        </div>

        {/* Type select */}
        <Select
          label="Filter by Type"
          id="type-filter"
          labelHidden
          value={type}
          onChange={(e) => onTypeChange(e.target.value)}
          options={TYPE_OPTIONS}
          wrapperClassName="flex-1 sm:flex-initial min-w-[120px]"
          className="text-xs sm:text-sm font-bold"
        />

        {/* Priority select */}
        <Select
          label="Filter by Priority"
          id="priority-filter"
          labelHidden
          value={priority}
          onChange={(e) => onPriorityChange(e.target.value)}
          options={PRIORITY_OPTIONS}
          wrapperClassName="flex-1 sm:flex-initial min-w-[120px]"
          className="text-xs sm:text-sm font-bold"
        />

        {/* Status select */}
        <Select
          label="Filter by Status"
          id="status-filter"
          labelHidden
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          options={STATUS_OPTIONS}
          wrapperClassName="flex-1 sm:flex-initial min-w-[120px]"
          className="text-xs sm:text-sm font-bold"
        />

        {/* Category select */}
        <Select
          label="Filter by Category"
          id="category-filter"
          labelHidden
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          options={categoryOptions}
          wrapperClassName="flex-1 sm:flex-initial min-w-[120px]"
          className="text-xs sm:text-sm font-bold"
        />

        {/* Clear Filters Button */}
        <Button
          variant="secondary"
          onClick={onClearFilters}
          className="flex-1 sm:flex-initial px-4 py-2.5 text-xs sm:text-sm text-slate-500 hover:text-slate-700"
        >
          Clear Filters
        </Button>
      </div>

    </div>
  );
}

export default GoalFilters;
export { GoalFilters };
