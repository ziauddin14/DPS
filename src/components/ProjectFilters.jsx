import { Search, SlidersHorizontal } from 'lucide-react';
import { Input, Select, Button } from './ui';

// Static option arrays defined outside the component (perf: no recreation on each render)
const STATUS_OPTIONS = [
  { value: 'All',         label: 'Status: All' },
  { value: 'Planning',    label: 'Planning' },
  { value: 'In Progress', label: 'In Progress' },
  { value: 'Completed',   label: 'Completed' },
  { value: 'On Hold',     label: 'On Hold' },
];

const PRIORITY_OPTIONS = [
  { value: 'All',    label: 'Priority: All' },
  { value: 'High',   label: 'High' },
  { value: 'Medium', label: 'Medium' },
  { value: 'Low',    label: 'Low' },
];

/**
 * ProjectFilters component.
 * Renders a controlled search input, status, priority, and dynamic category
 * dropdown filters alongside a Clear Filters action button.
 *
 * @param {string}   search          - Current search value.
 * @param {Function} onSearchChange  - Called with new search string.
 * @param {string}   status          - Current status filter value.
 * @param {Function} onStatusChange  - Called with new status value.
 * @param {string}   priority        - Current priority filter value.
 * @param {Function} onPriorityChange - Called with new priority value.
 * @param {string}   category        - Current category filter value.
 * @param {Function} onCategoryChange - Called with new category value.
 * @param {string[]} categories      - Distinct category values from the backend.
 * @param {Function} onClearFilters  - Called when Clear Filters is clicked.
 */
function ProjectFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  priority,
  onPriorityChange,
  category,
  onCategoryChange,
  categories = [],
  onClearFilters,
}) {
  // Build category options dynamically from backend-returned distinct values
  const categoryOptions = [
    { value: 'All', label: 'Category: All' },
    ...categories.map((cat) => ({ value: cat, label: cat })),
  ];

  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-4 sm:p-5 flex flex-col xl:flex-row gap-4 items-stretch xl:items-center justify-between">

      {/* Left: Search input */}
      <Input
        type="search"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search projects by title or description..."
        aria-label="Search projects"
        leftAddon={<Search className="w-5 h-5" aria-hidden="true" />}
        wrapperClassName="flex-1"
        className="w-full pl-11"
      />

      {/* Right: Dropdowns + Actions */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Decorative filter icon */}
        <div
          className="hidden sm:flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider pr-1"
          aria-hidden="true"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Filters</span>
        </div>

        {/* Status select */}
        <Select
          label="Filter by Status"
          id="project-status-filter"
          labelHidden
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          options={STATUS_OPTIONS}
          wrapperClassName="flex-1 sm:flex-initial min-w-[130px]"
          className="text-xs sm:text-sm font-bold"
        />

        {/* Priority select */}
        <Select
          label="Filter by Priority"
          id="project-priority-filter"
          labelHidden
          value={priority}
          onChange={(e) => onPriorityChange(e.target.value)}
          options={PRIORITY_OPTIONS}
          wrapperClassName="flex-1 sm:flex-initial min-w-[130px]"
          className="text-xs sm:text-sm font-bold"
        />

        {/* Category select */}
        <Select
          label="Filter by Category"
          id="project-category-filter"
          labelHidden
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          options={categoryOptions}
          wrapperClassName="flex-1 sm:flex-initial min-w-[130px]"
          className="text-xs sm:text-sm font-bold"
        />

        {/* Clear Filters button */}
        <Button
          type="button"
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

export default ProjectFilters;
export { ProjectFilters };
