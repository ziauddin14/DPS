import { Search, SlidersHorizontal, Calendar } from 'lucide-react';
import { Input, Select, Button } from './ui';

const CATEGORY_OPTIONS = [
  { value: 'All', label: 'Category: All' },
  { value: 'Email', label: 'Email' },
  { value: 'WhatsApp', label: 'WhatsApp' },
  { value: 'Phone Call', label: 'Phone Call' },
  { value: 'Meeting', label: 'Meeting' },
  { value: 'Documentation', label: 'Documentation' },
  { value: 'Research', label: 'Research' },
  { value: 'Development', label: 'Development' },
  { value: 'Testing', label: 'Testing' },
  { value: 'Planning', label: 'Planning' },
  { value: 'Learning', label: 'Learning' },
  { value: 'Office Work', label: 'Office Work' },
  { value: 'Deployment', label: 'Deployment' },
  { value: 'Bug Fix', label: 'Bug Fix' },
  { value: 'Support', label: 'Support' },
  { value: 'Other', label: 'Other' },
];

const DEPARTMENT_OPTIONS = [
  { value: 'All', label: 'Department: All' },
  { value: 'IT', label: 'IT' },
  { value: 'HR', label: 'HR' },
  { value: 'Finance', label: 'Finance' },
  { value: 'Marketing', label: 'Marketing' },
  { value: 'Sales', label: 'Sales' },
  { value: 'Operations', label: 'Operations' },
  { value: 'Legal', label: 'Legal' },
  { value: 'Other', label: 'Other' },
];

const DATE_FILTER_OPTIONS = [
  { value: 'All', label: 'Date: All' },
  { value: 'Today', label: 'Today' },
  { value: 'Yesterday', label: 'Yesterday' },
  { value: 'This Week', label: 'This Week' },
  { value: 'This Month', label: 'This Month' },
];

/**
 * WorkLogFilters component.
 * Renders controlled search input, category/department/date selection, and a clear button.
 */
function WorkLogFilters({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  department,
  onDepartmentChange,
  dateFilter,
  onDateFilterChange,
  exportStartDate,
  onExportStartDateChange,
  exportEndDate,
  onExportEndDateChange,
  onClearFilters,
}) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-4 sm:p-5 flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
      
      {/* Left: Search input */}
      <Input
        type="search"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search work logs..."
        aria-label="Search work logs"
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

        {/* Category select */}
        <Select
          label="Filter by Category"
          id="category-filter"
          labelHidden
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          options={CATEGORY_OPTIONS}
          wrapperClassName="flex-1 sm:flex-initial min-w-[120px]"
          className="text-xs sm:text-sm font-bold"
        />

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

        {/* Date Filter select */}
        <Select
          label="Filter by Date"
          id="date-filter"
          labelHidden
          value={dateFilter}
          onChange={(e) => onDateFilterChange(e.target.value)}
          options={DATE_FILTER_OPTIONS}
          wrapperClassName="flex-1 sm:flex-initial min-w-[120px]"
          className="text-xs sm:text-sm font-bold"
        />

        {/* Date Range */}
        <div className="hidden lg:flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2">
          <Calendar className="w-4 h-4 text-slate-400" />
          <input
            type="date"
            value={exportStartDate}
            onChange={(e) => onExportStartDateChange(e.target.value)}
            className="text-xs bg-transparent border-none focus:outline-none text-slate-600"
          />
          <span className="text-slate-400">-</span>
          <input
            type="date"
            value={exportEndDate}
            onChange={(e) => onExportEndDateChange(e.target.value)}
            className="text-xs bg-transparent border-none focus:outline-none text-slate-600"
          />
        </div>

        {/* Clear Filters Button */}
        <Button
          variant="secondary"
          onClick={onClearFilters}
          className="flex-1 sm:flex-initial px-4 py-2.5 text-xs sm:text-sm text-slate-500 hover:text-slate-700"
        >
          Clear
        </Button>
      </div>
    </div>
  );
}

export default WorkLogFilters;
export { WorkLogFilters };
