import { X } from "lucide-react";

export default function CommonModal({
  isOpen,
  onClose,
  title = "",
  headerExtras = null,
  children,
  maxHeight = "90vh",
  width = "max-w-3xl",
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1050] flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
      <div
        className={`relative flex flex-col w-full overflow-hidden rounded-xl bg-amber-50/80 backdrop-blur-sm shadow-xl border border-amber-100 ${width}`}
        style={{ maxHeight }}
      >
        {headerExtras && (
          <div className="flex justify-center px-4 py-3 border-b border-amber-100">
            {headerExtras}
          </div>
        )}

        <div className="relative px-4 py-3 bg-amber-50/90 border-b border-amber-200 shadow-sm">
          <h2 className="text-base font-semibold text-center text-amber-900 italic">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="absolute top-2 right-3 p-1.5 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-600 hover:text-amber-800 transition-colors duration-200"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 px-4 py-5 overflow-y-auto text-amber-900">
          {children}
        </div>
      </div>
    </div>
  );
}
