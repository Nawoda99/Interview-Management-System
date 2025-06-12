import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, Search, X } from "lucide-react";
import { createPortal } from "react-dom";

// Debounce helper
function debounce(fn, delay) {
  let timeoutId;
  return (...args) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

const Dropdown = ({
  options = [],
  value,
  onChange,
  placeholder = "Select an option",
  searchable = false,
  multiple = false,
  disabled = false,
  error = "",
  label = "",
  icon: Icon,
  className = "",
  size = "medium",
  variant = "default",
  clearable = false,
  maxHeight = "200px",
  loading = false,
  emptyMessage = "No options available",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);
  const searchInputRef = useRef(null);

  const calculatePosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const scrollLeft =
        window.pageXOffset || document.documentElement.scrollLeft;

      setDropdownPosition({
        top: rect.bottom + scrollTop + 4,
        left: rect.left + scrollLeft,
        width: rect.width,
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      const debouncedPosition = debounce(calculatePosition, 100);
      calculatePosition();
      window.addEventListener("scroll", debouncedPosition);
      window.addEventListener("resize", debouncedPosition);

      return () => {
        window.removeEventListener("scroll", debouncedPosition);
        window.removeEventListener("resize", debouncedPosition);
      };
    }
  }, [isOpen]);

  useEffect(() => {
    let ignoreClick = false;
    const onScroll = () => {
      ignoreClick = true;
      setTimeout(() => {
        ignoreClick = false;
      }, 200);
    };

    const handleClickOutside = (event) => {
      if (ignoreClick) return;
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    window.addEventListener("scroll", onScroll);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, searchable]);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOptionSelect = (option) => {
    if (multiple) {
      const currentValues = Array.isArray(value) ? value : [];
      const isSelected = currentValues.some((v) => v.value === option.value);
      if (isSelected) {
        onChange(currentValues.filter((v) => v.value !== option.value));
      } else {
        onChange([...currentValues, option]);
      }
    } else {
      onChange(option);
      setIsOpen(false);
      setSearchTerm("");
    }
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange(multiple ? [] : null);
  };

  const handleRemoveItem = (e, optionToRemove) => {
    e.stopPropagation();
    if (multiple && Array.isArray(value)) {
      onChange(value.filter((v) => v.value !== optionToRemove.value));
    }
  };

  const isOptionSelected = (option) => {
    if (multiple) {
      return (
        Array.isArray(value) && value.some((v) => v.value === option.value)
      );
    }
    return value && value.value === option.value;
  };

  const getDisplayText = () => {
    if (multiple) {
      if (!Array.isArray(value) || value.length === 0) return placeholder;
      if (value.length === 1) return value[0].label;
      return `${value.length} items selected`;
    }
    return value ? value.label : placeholder;
  };

  const sizeClasses = {
    small: "px-3 py-2 text-sm",
    medium: "px-4 py-3 text-base",
    large: "px-5 py-4 text-lg",
  };

  const variantClasses = {
    default: "border-amber-200 focus:ring-amber-500 focus:border-amber-500",
    error: "border-red-300 focus:ring-red-500 focus:border-red-500",
    success: "border-green-300 focus:ring-green-500 focus:border-green-500",
  };

  const currentVariant = error ? "error" : variant;

  const DropdownMenu = () => (
    <div
      ref={dropdownRef}
      className="absolute mt-1 w-full z-50 bg-white border border-amber-200 rounded-lg shadow-2xl max-h-80 overflow-hidden"
      style={{
        top: dropdownPosition.top,
        left: dropdownPosition.left,
        width: dropdownPosition.width,
        zIndex: 9999,
      }}
    >
      {searchable && (
        <div className="p-3 border-b border-amber-100 bg-white sticky top-0">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-400"
            />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search options..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-amber-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm bg-white"
            />
          </div>
        </div>
      )}

      <div className="overflow-y-auto" style={{ maxHeight }}>
        {filteredOptions.length === 0 ? (
          <div className="px-4 py-6 text-sm text-amber-500 text-center bg-white">
            {emptyMessage}
          </div>
        ) : (
          filteredOptions.map((option, index) => (
            <button
              key={`${option.value}-${index}`}
              type="button"
              onClick={() => handleOptionSelect(option)}
              className={`w-full px-4 py-3 text-left flex items-center justify-between hover:bg-amber-50 transition-colors duration-150 bg-white ${
                isOptionSelected(option)
                  ? "bg-amber-100 text-amber-900"
                  : "text-amber-700"
              } ${index > 0 ? "border-t border-amber-50" : ""}`}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {option.icon && (
                  <option.icon
                    size={16}
                    className="text-amber-600 flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <span className="font-medium block truncate">
                    {option.label}
                  </span>
                  {option.description && (
                    <span className="text-xs text-amber-500 block truncate">
                      {option.description}
                    </span>
                  )}
                </div>
              </div>
              {isOptionSelected(option) && (
                <Check
                  size={16}
                  className="text-amber-600 flex-shrink-0 ml-2"
                />
              )}
            </button>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="text-sm font-medium text-amber-900 mb-2 flex items-center gap-2">
          {Icon && <Icon size={16} />}
          {label}
        </label>
      )}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full flex items-center justify-between bg-white border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-200 ${
          sizeClasses[size]
        } ${variantClasses[currentVariant]} ${
          disabled
            ? "bg-amber-50 text-amber-400 cursor-not-allowed"
            : "hover:bg-amber-50/50"
        } ${isOpen ? "ring-2" : ""}`}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {multiple && Array.isArray(value) && value.length > 0 ? (
            <div className="flex flex-wrap gap-1 flex-1">
              {value.slice(0, 3).map((item) => (
                <span
                  key={item.value}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-md"
                >
                  {item.label}
                  <button
                    onClick={(e) => handleRemoveItem(e, item)}
                    className="hover:text-amber-900 transition-colors"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
              {value.length > 3 && (
                <span className="px-2 py-1 bg-amber-200 text-amber-800 text-xs rounded-md">
                  +{value.length - 3} more
                </span>
              )}
            </div>
          ) : (
            <span
              className={`truncate ${
                !value || (multiple && (!value || value.length === 0))
                  ? "text-amber-500"
                  : "text-amber-900"
              }`}
            >
              {getDisplayText()}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 ml-2">
          {clearable &&
            ((multiple && value && value.length > 0) || (!multiple && value)) &&
            !disabled && (
              <button
                onClick={handleClear}
                className="text-amber-400 hover:text-amber-600 transition-colors"
                type="button"
              >
                <X size={16} />
              </button>
            )}
          {loading ? (
            <div className="w-4 h-4 border-2 border-amber-300 border-t-amber-600 rounded-full animate-spin" />
          ) : (
            <ChevronDown
              size={16}
              className={`text-amber-500 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          )}
        </div>
      </button>
      {isOpen &&
        !disabled &&
        typeof window !== "undefined" &&
        createPortal(<DropdownMenu />, document.body)}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default Dropdown;
