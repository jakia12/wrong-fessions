"use client";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { voteTrollFession } from "./actions";

export default function VoteButtons({ id, likes, dislikes }) {
  const [voted, setVoted] = useState(null); // 'like' | 'dislike' | null
  const [likeCount, setLikeCount] = useState(likes);
  const [dislikeCount, setDislikeCount] = useState(dislikes);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // Update local state when props change (after page refresh)
  useEffect(() => {
    setLikeCount(likes);
    setDislikeCount(dislikes);
  }, [likes, dislikes]);

  useEffect(() => {
    const stored = localStorage.getItem(`troll-vote-${id}`);
    if (stored === "like" || stored === "dislike") setVoted(stored);
  }, [id]);

  async function handleVote(type) {
    if (voted || isPending) return;

    setVoted(type);
    localStorage.setItem(`troll-vote-${id}`, type);
    // Optimistic update
    if (type === "like") setLikeCount(likeCount + 1);
    else setDislikeCount(dislikeCount + 1);

    startTransition(async () => {
      try {
        await voteTrollFession(id, type);
        // Refresh the page to update the post list
        router.refresh();
      } catch (error) {
        console.error("Failed to vote:", error);
        // Revert optimistic update on error
        if (type === "like") setLikeCount(likeCount);
        else setDislikeCount(dislikeCount);
        setVoted(null);
        localStorage.removeItem(`troll-vote-${id}`);
      }
    });
  }

  return (
    <div className="flex items-center gap-4 mb-2">
      <button
        type="button"
        onClick={() => handleVote("like")}
        disabled={!!voted || isPending}
        className={`px-2 py-1 rounded bg-[#00000080] border border-[color:var(--color-primary)] [color:var(--color-primary)] hover:bg-[color:var(--color-primary)] hover:text-black transition flex items-center gap-1 ${
          voted || isPending ? "opacity-50 cursor-not-allowed" : ""
        }`}
        aria-label="Like"
      >
        <ThumbsUp size={18} /> {likeCount}
      </button>
      <button
        type="button"
        onClick={() => handleVote("dislike")}
        disabled={!!voted || isPending}
        className={`px-2 py-1 rounded bg-[#00000080] border border-[color:var(--color-secondary)] [color:var(--color-secondary)] hover:bg-[color:var(--color-secondary)] hover:text-black transition flex items-center gap-1 ${
          voted || isPending ? "opacity-50 cursor-not-allowed" : ""
        }`}
        aria-label="Dislike"
      >
        <ThumbsDown size={18} /> {dislikeCount}
      </button>
    </div>
  );
}
