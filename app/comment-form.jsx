"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CommentForm({ postId, onCommentAdded }) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!content.trim() || isSubmitting) return;

    setError("");
    console.log("Submitting comment:", { postId, content: content.trim() });
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: postId, content: content.trim() }),
      });

      console.log("Response status:", response.status);
      const responseData = await response.json();
      console.log("Response data:", responseData);

      if (response.ok) {
        setContent("");
        // Refresh the page to show the new comment
        router.refresh();
        if (onCommentAdded) {
          onCommentAdded();
        }
      } else {
        setError(
          `Failed to submit comment: ${
            responseData.error || response.statusText
          }`
        );
        console.error("Failed to submit comment:", response.statusText);
      }
    } catch (error) {
      setError(`Network error: ${error.message}`);
      console.error("Error submitting comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={500}
          placeholder="Add a comment..."
          className="flex-1 bg-[#00000080] border border-[color:var(--color-primary)] rounded px-3 py-2 [color:var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-secondary)]"
          disabled={isSubmitting}
        />
        <button
          type="submit"
          disabled={!content.trim() || isSubmitting}
          className="px-4 py-2 bg-[color:var(--color-primary)] text-black font-bold rounded border border-[color:var(--color-secondary)] hover:bg-[color:var(--color-secondary)] transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "..." : "Comment"}
        </button>
      </div>
      {error && <div className="mt-2 text-red-500 text-sm">{error}</div>}
    </form>
  );
}
