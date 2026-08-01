import { Search, SlidersHorizontal } from 'lucide-react';
import { Input, Select, Button } from './ui';

// Static filter options
const TYPE_OPTIONS = [
  { value: 'All',       label: 'Type: All' },
  { value: 'Note',      label: 'Note' },
  { value: 'Book',      label: 'Book' },
  { value: 'Article',   label: 'Article' },
  { value: 'Idea',      label: 'Idea' },
  { value: 'Learning',  label: 'Learning' },
  { value: 'Reference', label: 'Reference' },
];

const FAVORITE_OPTIONS = [
  { value: 'All',  label: 'Starred: All' },
  { value: 'true', label: 'Starred Only' },
];

/**
 * KnowledgeFilters component.
 * Renders controlled search, type, dynamic category dropdowns, and favorite filter.
 */
function KnowledgeFilters({
  search,
  onSearchChange,
  type,
  onTypeChange,
  category,
  onCategoryChange,
  favorite,
  onFavoriteChange,
  categories = [],
  onClearFilters,
}) {
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
        placeholder="Search by title, content, or tags..."
        aria-label="Search knowledge entries"
        leftAddon={<Search className="w-5 h-5" aria-hidden="true" />}
        wrapperClassName="flex-1"
        className="w-full pl-11"
      />

      {/* Right: Dropdowns + Actions */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider pr-1" aria-hidden="true">
          <SlidersHorizontal className="w-4 h-4" />
          <span>Filters</span>
        </div>

        {/* Type Filter */}
        <Select
          label="Filter by Type"
          id="knowledge-type-filter"
          labelHidden
          value={type}
          onChange={(e) => onTypeChange(e.target.value)}
          options={TYPE_OPTIONS}
          wrapperClassName="flex-1 sm:flex-initial min-w-[130px]"
          className="text-xs sm:text-sm font-bold"
        />

        {/* Category Filter */}
        <Select
          label="Filter by Category"
          id="knowledge-category-filter"
          labelHidden
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          options={categoryOptions}
          wrapperClassName="flex-1 sm:flex-initial min-w-[130px]"
          className="text-xs sm:text-sm font-bold"
        />

        {/* Starred/Favorite Filter */}
        <Select
          label="Filter by Starred"
          id="knowledge-fav-filter"
          labelHidden
          value={favorite}
          onChange={(e) => onFavoriteChange(e.target.value)}
          options={FAVORITE_OPTIONS}
          wrapperClassName="flex-1 sm:flex-initial min-w-[130px]"
          className="text-xs sm:text-sm font-bold"
        />

        {/* Clear filters */}
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

export default KnowledgeFilters;
export { KnowledgeFilters };
