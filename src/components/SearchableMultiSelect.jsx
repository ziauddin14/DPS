import { useState, useRef, useEffect } from 'react';
import { X, ChevronDown, Search } from 'lucide-react';

/**
 * SearchableMultiSelect component - Enterprise-grade multi-select with search
 */
function SearchableMultiSelect({ options, value = [], onChange, placeholder = 'Search...', label }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Filter options based on search term and exclude already selected
  const filteredOptions = options.filter(
    (option) =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !value.includes(option.value)
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Focus input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setSearchTerm('');
    } else if (e.key === 'ArrowDown' && isOpen) {
      e.preventDefault();
      // Focus first option
      const firstOption = dropdownRef.current?.querySelector('[role="option"]');
      firstOption?.focus();
    }
  };

  const handleSelect = (optionValue) => {
    if (!value.includes(optionValue)) {
      onChange([...value, optionValue]);
    }
    setSearchTerm('');
    inputRef.current?.focus();
  };

  const handleRemove = (optionValue, e) => {
    e.stopPropagation();
    onChange(value.filter((v) => v !== optionValue));
  };

  const selectedOptions = options.filter((opt) => value.includes(opt.value));

  return (
    <div className="relative" ref={dropdownRef}>
      {label && (
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
          {label}
        </label>
      )}
      
      {/* Selected chips + search input */}
      <div
        className="flex flex-wrap gap-2 p-2.5 border border-slate-200 rounded-xl bg-white focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/20 transition-all cursor-text"
        onClick={() => {
          setIsOpen(true);
          inputRef.current?.focus();
        }}
      >
        {/* Selected chips */}
        {selectedOptions.map((option) => (
          <div
            key={option.value}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-primary-50 border border-primary-200 rounded-lg text-xs font-medium text-primary-700"
          >
            {option.label}
            <button
              type="button"
              onClick={(e) => handleRemove(option.value, e)}
              className="hover:text-primary-900 transition-colors"
              aria-label={`Remove ${option.label}`}
            >
              <X className="w-3.5 h-3" />
            </button>
          </div>
        ))}

        {/* Search input */}
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={selectedOptions.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[120px] outline-none text-sm text-slate-700 placeholder:text-slate-400"
        />

        {/* Dropdown arrow */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
          aria-label="Toggle dropdown"
        >
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-auto">
          {filteredOptions.length === 0 ? (
            <div className="px-4 py-3 text-sm text-slate-400 text-center">
              No options found
            </div>
          ) : (
            filteredOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                role="option"
                className="w-full px-4 py-2.5 text-sm text-left text-slate-700 hover:bg-slate-50 transition-colors focus:bg-slate-50 focus:outline-none"
              >
                {option.label}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default SearchableMultiSelect;
export { SearchableMultiSelect };
