"use client";

import { useEffect, useState } from "react";

export function Toast({ message, type = "success", onClose }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for fade out animation
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === "success" ? "bg-[#00ff00]" : "bg-[#ff4444]";
  const textColor = type === "success" ? "text-black" : "text-white";
  const icon = type === "success" ? "✓" : "✗";

  return (
    <div
      className={`fixed top-4 right-4 z-50 ${bgColor} ${textColor} px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 border-2 border-[color:var(--color-secondary)] ${
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
    >
      <div className="flex items-center gap-2">
        <span className="font-bold">{icon}</span>
        <span>{message}</span>
      </div>
    </div>
  );
}

export function ToastContainer({ toasts, removeToast }) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}
