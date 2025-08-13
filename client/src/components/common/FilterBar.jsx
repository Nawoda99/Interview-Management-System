const FilterBar = ({
  searchPlaceholder = "Search...",
  searchValue,
  onSearchChange,
  filters = [],
  actions = [],
  className = "",
}) => (
  <div
    className={`flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between p-6 border-b border-amber-200 ${className}`}
  >
    <div className="flex flex-col sm:flex-row gap-4 flex-1">
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-4 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white/80 w-full sm:w-64"
        />
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-500">
          <svg
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </span>
      </div>

      {/* Filter Dropdowns */}
      {filters.map((filter, index) => (
        <select
          key={index}
          value={filter.value}
          onChange={(e) => filter.onChange(e.target.value)}
          className="px-4 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white/80"
        >
          {filter.options.map((option, optIndex) => (
            <option key={optIndex} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ))}
    </div>

    {/* Action Buttons */}
    <div className="flex items-center justify-center gap-2">
      {actions.map((action, index) => (
        <button
          key={index}
          onClick={action.onClick}
          className={
            action.className ||
            "bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg flex items-center"
          }
        >
          {action.icon && <span className="mr-2">{action.icon}</span>}
          {action.label}
        </button>
      ))}
    </div>
  </div>
);

export default FilterBar;
