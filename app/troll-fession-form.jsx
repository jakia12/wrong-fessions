"use client";

import { useState, useTransition } from "react";
import { ToastContainer } from "./toast";

export default function TrollFessionForm({ createTrollFession, onDataUpdate }) {
  const [isPending, startTransition] = useTransition();
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const handleSubmit = (formData) => {
    startTransition(async () => {
      try {
        await createTrollFession(formData);
        addToast("Wrong-fession submitted successfully!", "success");

        // Reset form
        const form = document.getElementById("troll-fession-form");
        if (form) form.reset();

        // Trigger immediate data refresh
        if (onDataUpdate) {
          try {
            const response = await fetch("/api/refresh-data");
            if (response.ok) {
              const result = await response.json();
              if (result.success && result.data) {
                onDataUpdate(result.data);
              }
            }
          } catch (error) {
            console.error("Failed to refresh data after submission:", error);
          }
        }
      } catch (error) {
        addToast("Failed to submit wrong-fession. Please try again.", "error");
      }
    });
  };

  return (
    <>
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      <section className="w-full max-w-xl bg-[#00000080] border-2 border-[color:var(--color-primary)] rounded-lg p-6 mb-10 shadow-lg">
        <form
          id="troll-fession-form"
          action={handleSubmit}
          className="flex flex-col gap-3"
        >
          <label
            htmlFor="content"
            className="[color:var(--color-primary)] font-bold"
          >
            <span className="inline-flex items-center gap-2">
              SHARE YOUR{" "}
              <span className="[color:var(--color-secondary)]">
                WRONG-FESSION
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="inline-block ml-1"
                width="20"
                height="20"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                style={{ color: "var(--color-secondary)" }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 8.25V6a3 3 0 00-6 0v2.25M12 15v-6m0 0l-3 3m3-3l3 3M19.5 12a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z"
                />
              </svg>
            </span>
          </label>
          <textarea
            id="content"
            name="content"
            maxLength={500}
            required
            disabled={isPending}
            className="bg-[#00000080] border border-[color:var(--color-primary)] rounded p-2 [color:var(--color-primary)] resize-none focus:outline-none focus:ring-2 focus:ring-[color:var(--color-secondary)] disabled:opacity-50"
            placeholder="Share your anonymous confession, thoughts, or wrong moments..."
            rows={4}
          />
          <button
            type="submit"
            disabled={isPending}
            className="mt-2 bg-[color:var(--color-primary)] text-black font-bold py-2 rounded border-2 border-[color:var(--color-secondary)] hover:bg-[color:var(--color-secondary)] hover:text-black transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isPending ? (
              <>
                <svg
                  className="animate-spin h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                SUBMITTING...
              </>
            ) : (
              "SUBMIT WRONG-FESSION"
            )}
          </button>
          <p className="text-xs text-[#aaa] mt-2">
            Fully anonymous – no login required. Visible to all. Never deleted
            unless by admin.
          </p>
        </form>
      </section>
    </>
  );
}
