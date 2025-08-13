import React, { useEffect, useState } from "react";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";

const iconMap = {
  success: <CheckCircle className="w-10 h-10 text-green-600" />,
  error: <XCircle className="w-10 h-10 text-red-600" />,
  warning: <AlertTriangle className="w-10 h-10 text-yellow-600" />,
  info: <Info className="w-10 h-10 text-blue-600" />,
};

const titleMap = {
  success: "Success",
  error: "Error",
  warning: "Warning",
  info: "Info",
};

export default function MessagePop({
  type = "success",
  message = "",
  onClose = () => {},
  duration = 3000,
  onComplete = () => {},
}) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const animateTimer = setTimeout(() => setAnimate(true), 10);
    const closeTimer = setTimeout(() => {
      onClose();
      onComplete();
    }, duration);

    return () => {
      clearTimeout(animateTimer);
      clearTimeout(closeTimer);
    };
  }, [duration, onClose]);

  const barColor = {
    success: "bg-green-500",
    error: "bg-red-500",
    warning: "bg-yellow-500",
    info: "bg-blue-500",
  }[type];

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">
      <div className="relative w-full max-w-sm overflow-hidden text-center bg-white shadow-xl rounded-xl animate-fade-in">
        <button
          onClick={onClose}
          className="absolute text-gray-400 top-3 right-3 hover:text-gray-600"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center justify-center gap-2 px-6 py-6">
          {iconMap[type]}
          <h3
            className={`text-lg font-semibold ${
              type === "error"
                ? "text-red-600"
                : type === "warning"
                ? "text-yellow-600"
                : "text-purple-700"
            }`}
          >
            {titleMap[type]}
          </h3>
          <p className="text-sm text-gray-600">{message}</p>
        </div>

        <div className="w-full h-1 bg-gray-200">
          <div
            className={`h-1 ${barColor} transition-all`}
            style={{
              width: animate ? "100%" : "0%",
              transitionDuration: `${duration}ms`,
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}
