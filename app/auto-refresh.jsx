"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AutoRefresh() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(15);
  const [isUpdating, setIsUpdating] = useState(false);

  // Handle countdown
  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => (prev <= 1 ? 15 : prev - 1));
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, []);

  // Handle refresh when countdown reaches 0
  useEffect(() => {
    if (countdown === 15 && !isUpdating) {
      // This means we just reset, so trigger refresh
      setIsUpdating(true);
      router.refresh();

      // Hide updating state after a short delay
      setTimeout(() => {
        setIsUpdating(false);
      }, 1000);
    }
  }, [countdown, isUpdating, router]);

  return (
    <div className="fixed top-4 left-4 z-[9999] bg-[#000000c4] border border-[color:var(--color-primary)] rounded-lg px-3 py-2 text-xs flex items-center gap-2">
      {isUpdating ? (
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-[color:var(--color-secondary)] rounded-full animate-pulse"></div>
          <span className="[color:var(--color-secondary)] font-mono">
            Updating...
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <svg
            className="animate-spin h-3 w-3"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            style={{ color: "var(--color-secondary)" }}
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span className="[color:var(--color-primary)]">
            Refresh in{" "}
            <span className="[color:var(--color-secondary)] font-bold">
              {countdown}s
            </span>
          </span>
        </div>
      )}
    </div>
  );
}
