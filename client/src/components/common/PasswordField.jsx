import React from "react";
import { Lock, Eye, EyeOff } from "lucide-react";

const PasswordField = ({
  label,
  value,
  onChange,
  error,
  showPassword,
  onToggleVisibility,
  placeholder,
  className = "",
}) => (
  <div className={`space-y-2 ${className}`}>
    <label className="text-sm font-medium text-amber-900 flex items-center gap-2">
      <Lock size={16} />
      {label}
    </label>
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white/80 text-gray-700 transition-colors ${
          error ? "border-red-300 focus:ring-red-500" : "border-amber-200"
        }`}
      />
      <button
        type="button"
        onClick={onToggleVisibility}
        className="absolute inset-y-0 right-0 pr-3 flex items-center"
        tabIndex={-1}
      >
        {showPassword ? (
          <EyeOff size={18} className="text-amber-500 hover:text-amber-600" />
        ) : (
          <Eye size={18} className="text-amber-500 hover:text-amber-600" />
        )}
      </button>
    </div>
    {error && <p className="text-red-500 text-sm">{error}</p>}
  </div>
);

export default PasswordField;
