import React from "react";

const InputField = ({
  label,
  value,
  onChange,
  type = "text",
  disabled = false,
  error,
  icon: Icon,
  placeholder,
  className = "",
}) => (
  <div className={`space-y-2 ${className}`}>
    <label className="flex items-center gap-2 text-sm font-medium text-amber-900">
      {Icon && <Icon size={16} />}
      {label}
      {disabled && <span className="text-xs text-amber-600">(Read-only)</span>}
    </label>
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white/80 text-amber-600 transition-colors ${
          disabled ? "bg-amber-50 text-gray-600 cursor-not-allowed" : ""
        } ${error ? "border-red-300 focus:ring-red-500" : "border-amber-200"}`}
      />
    </div>
    {error && <p className="text-sm text-red-500">{error}</p>}
  </div>
);

export default InputField;
