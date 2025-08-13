import React, { useState, useRef, useEffect } from "react";

export default function CustomDropdown({
  options = [],
  name = "",
  multiSelect = false,
  value = multiSelect ? [] : null,
  onChange = () => {},
  placeholder = "Select...",
  label = null,
  pageSize = 5,
  width = "max-w-md",
  className = "",
  disabled = false,
  icon: Icon = null,
  required = false,
  error = "",
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const dropdownRef = useRef(null);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredOptions.length / pageSize);
  const paginatedOptions = filteredOptions.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const toggleOption = (option) => {
    if (disabled) return;
    if (multiSelect) {
      const isAlreadySelected = Array.isArray(value)
        ? value.some((s) => s.value === option.value)
        : false;
      const newSelection = isAlreadySelected
        ? value.filter((s) => s.value !== option.value)
        : [...(value || []), option];
      onChange(newSelection);
    } else {
      onChange(option);
      setIsOpen(false);
    }
  };

  const removeTag = (optionValue) => {
    if (disabled) return;
    const updated = value.filter((s) => s.value !== optionValue);
    onChange(updated);
  };

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, []);

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="flex items-center gap-2 text-sm font-medium text-amber-900">
          {Icon && <Icon size={16} />}
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className={`relative w-full ${width}`} ref={dropdownRef}>
        <div
          onClick={() => {
            if (!disabled) setIsOpen((prev) => !prev);
          }}
          className={`flex flex-wrap items-center justify-between w-full px-4 py-3 text-sm transition-colors duration-200 bg-white border rounded-lg shadow-sm cursor-pointer
            ${
              error
                ? "border-red-500 focus:border-red-500"
                : "border-amber-300 hover:border-amber-400 focus:border-amber-500"
            }
            ${disabled ? "bg-gray-100 cursor-not-allowed opacity-60" : ""}
          `}
        >
          <div className="flex flex-wrap gap-1 overflow-hidden">
            {multiSelect ? (
              Array.isArray(value) && value.length ? (
                value.map((item) => (
                  <span
                    key={item.value}
                    className="flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full text-amber-700 bg-amber-100"
                  >
                    {item.label}
                    {!disabled && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeTag(item.value);
                        }}
                        className="text-xs text-amber-500 hover:text-amber-800"
                      >
                        ✕
                      </button>
                    )}
                  </span>
                ))
              ) : (
                <span className="text-gray-400">{placeholder}</span>
              )
            ) : value ? (
              <span className="text-amber-900">{value.label}</span>
            ) : (
              <span className="text-gray-400">{placeholder}</span>
            )}
          </div>
          <svg
            className="w-4 h-4 text-amber-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.24 4.5a.75.75 0 01-1.08 0l-4.24-4.5a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        {isOpen && !disabled && (
          <div className="absolute z-50 w-full mt-2 bg-white border rounded-lg shadow-lg border-amber-300">
            <div className="flex items-center px-3 py-2 border-b border-amber-200 bg-amber-50">
              <input
                type="text"
                placeholder="Search..."
                className="flex-1 text-sm bg-transparent outline-none text-amber-900 placeholder-amber-600"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                disabled={disabled}
              />
              {multiSelect &&
                Array.isArray(value) &&
                value.length > 0 &&
                !disabled && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onChange([]);
                    }}
                    className="p-1 ml-2 text-red-500 rounded-full hover:text-red-600"
                    title="Clear All"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
            </div>

            <ul className="mb-1 overflow-y-auto text-sm max-h-56">
              {paginatedOptions.map((option) => {
                const isSelected = multiSelect
                  ? Array.isArray(value) &&
                    value.some((s) => s.value === option.value)
                  : value?.value === option.value;

                return (
                  <li
                    key={option.value}
                    onClick={() => {
                      if (!option.disabled && !disabled) toggleOption(option);
                    }}
                    className={`flex items-center justify-between px-4 py-2 cursor-pointer transition hover:bg-amber-100 text-amber-900
          ${isSelected ? "font-medium text-amber-700 bg-amber-50" : ""}
          ${option.disabled || disabled ? "opacity-50 cursor-not-allowed" : ""}
        `}
                    aria-disabled={option.disabled || disabled}
                  >
                    <span>{option.label}</span>
                    {isSelected && (
                      <svg
                        className="w-4 h-4 text-amber-600"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </li>
                );
              })}
              {filteredOptions.length === 0 && (
                <li className="px-4 py-2 text-amber-600">No results found</li>
              )}
            </ul>

            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-2 text-sm border-t text-amber-600 border-amber-200 bg-amber-50">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1 || disabled}
                  className="px-2 py-1 rounded hover:text-amber-800 disabled:opacity-40"
                >
                  Prev
                </button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages || disabled}
                  className="px-2 py-1 rounded hover:text-amber-800 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
