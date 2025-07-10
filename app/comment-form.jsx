"use client";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { replyTrollFession } from "./actions";

export default function CommentForm({ postId, onCommentAdded }) {
  const [content, setContent] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!content.trim() || isPending) return;

    setError("");
    // console.log("Submitting comment:", { postId, content: content.trim() });

    startTransition(async () => {
      try {
        await replyTrollFession(postId, content.trim());
        setContent("");
        // Refresh the page to show the new comment
        router.refresh();
        if (onCommentAdded) {
          onCommentAdded();
        }
      } catch (error) {
        setError(`Failed to submit comment: ${error.message}`);
        console.error("Error submitting comment:", error);
      }
    });
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
          disabled={isPending}
        />
        <button
          type="submit"
          disabled={!content.trim() || isPending}
          className="px-4 py-2 bg-[color:var(--color-primary)] text-black font-bold rounded border border-[color:var(--color-secondary)] hover:bg-[color:var(--color-secondary)] transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "..." : "Comment"}
        </button>
      </div>
      {error && <div className="mt-2 text-red-500 text-sm">{error}</div>}
    </form>
  );
}
