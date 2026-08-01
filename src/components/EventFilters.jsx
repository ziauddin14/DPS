import { Search, SlidersHorizontal } from 'lucide-react';
import { Input, Select, Button } from './ui';

// Static option arrays defined outside the component (perf: no recreation on each render)
const TYPE_OPTIONS = [
  { value: 'All',      label: 'Type: All' },
  { value: 'Meeting',  label: 'Meeting' },
  { value: 'Event',    label: 'Event' },
  { value: 'Birthday', label: 'Birthday' },
  { value: 'Reminder', label: 'Reminder' },
];

const DATE_RANGE_OPTIONS = [
  { value: 'All',        label: 'Date: All' },
  { value: 'Upcoming',   label: 'Upcoming' },
  { value: 'Today',      label: 'Today' },
  { value: 'This Week',  label: 'This Week' },
  { value: 'This Month', label: 'This Month' },
];

/**
 * EventFilters component.
 * Renders a controlled search input, event type dropdown, date range dropdown,
 * and a clear button.
 *
 * @param {string}   search           - Current search value.
 * @param {Function} onSearchChange   - Called with new search string.
 * @param {string}   type             - Current type filter value.
 * @param {Function} onTypeChange     - Called with new type value.
 * @param {string}   dateRange        - Current date range label ('All' | 'Upcoming' | 'Today' | 'This Week' | 'This Month').
 * @param {Function} onDateRangeChange - Called with new dateRange value.
 * @param {Function} onClearFilters   - Called when Clear Filters is clicked.
 */
function EventFilters({
  search,
  onSearchChange,
  type,
  onTypeChange,
  dateRange,
  onDateRangeChange,
  onClearFilters,
}) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-4 sm:p-5 flex flex-col xl:flex-row gap-4 items-stretch xl:items-center justify-between">

      {/* Left: Search input */}
      <Input
        type="search"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search events by title or description..."
        aria-label="Search events"
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

        {/* Type select */}
        <Select
          label="Filter by Type"
          id="event-type-filter"
          labelHidden
          value={type}
          onChange={(e) => onTypeChange(e.target.value)}
          options={TYPE_OPTIONS}
          wrapperClassName="flex-1 sm:flex-initial min-w-[130px]"
          className="text-xs sm:text-sm font-bold"
        />

        {/* Date range select */}
        <Select
          label="Filter by Date Range"
          id="event-date-range-filter"
          labelHidden
          value={dateRange}
          onChange={(e) => onDateRangeChange(e.target.value)}
          options={DATE_RANGE_OPTIONS}
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

export default EventFilters;
export { EventFilters };
