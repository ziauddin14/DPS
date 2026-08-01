import { Search, SlidersHorizontal } from 'lucide-react';
import { Input, Select, Button } from './ui';
import { DEPENDENCY_OPTIONS } from '../constants/dependencyOptions';

const PRIORITY_OPTIONS = [
  { value: 'All', label: 'Priority: All' },
  { value: 'High', label: 'High' },
  { value: 'Medium', label: 'Medium' },
  { value: 'Low', label: 'Low' },
];

const STATUS_OPTIONS = [
  { value: 'All', label: 'Status: All' },
  { value: 'Pending', label: 'Pending' },
  { value: 'In Progress', label: 'In Progress' },
  { value: 'Completed', label: 'Completed' },
];

const DEPARTMENT_OPTIONS = [
  { value: 'All', label: 'Department: All' },
  { value: 'ETD', label: 'ETD' },
  { value: 'NTD', label: 'NTD' },
];

// Add "All" option to dependency options for filter
const FILTER_DEPENDENCY_OPTIONS = [
  { value: 'All', label: 'Dependency: All' },
  ...DEPENDENCY_OPTIONS,
];

/**
 * TaskFilters component.
 * Renders controlled search input, department/dependency selection list, filter dropdowns, and a clear button.
 */
function TaskFilters({
  search,
  onSearchChange,
  department,
  onDepartmentChange,
  priority,
  onPriorityChange,
  status,
  onStatusChange,
  dependency,
  onDependencyChange,
  onClearFilters,
}) {

  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-4 sm:p-5 flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
      
      {/* Left: Search input */}
      <Input
        type="search"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search tasks..."
        aria-label="Search tasks"
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

        {/* Department select */}
        <Select
          label="Filter by Department"
          id="department-filter"
          labelHidden
          value={department}
          onChange={(e) => onDepartmentChange(e.target.value)}
          options={DEPARTMENT_OPTIONS}
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

        {/* Dependency select */}
        <Select
          label="Filter by Dependency"
          id="dependency-filter"
          labelHidden
          value={dependency}
          onChange={(e) => onDependencyChange(e.target.value)}
          options={FILTER_DEPENDENCY_OPTIONS}
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

export default TaskFilters;
export { TaskFilters };
