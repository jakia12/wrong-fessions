"use client";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function VoteButtons({ id, likes, dislikes }) {
  const [voted, setVoted] = useState(null); // 'like' | 'dislike' | null
  const [likeCount, setLikeCount] = useState(likes);
  const [dislikeCount, setDislikeCount] = useState(dislikes);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem(`troll-vote-${id}`);
    if (stored === "like" || stored === "dislike") setVoted(stored);
  }, [id]);

  async function handleVote(type) {
    if (voted) return;
    setVoted(type);
    localStorage.setItem(`troll-vote-${id}`, type);
    // Optimistic update
    if (type === "like") setLikeCount(likeCount + 1);
    else setDislikeCount(dislikeCount + 1);
    // Call server action via fetch
    await fetch(`/api/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, type }),
    });
    // Refresh the page to update the post list
    router.refresh();
  }

  return (
    <div className="flex items-center gap-4 mb-2">
      <button
        type="button"
        onClick={() => handleVote("like")}
        disabled={!!voted}
        className={`px-2 py-1 rounded bg-[#00000080] border border-[color:var(--color-primary)] [color:var(--color-primary)] hover:bg-[color:var(--color-primary)] hover:text-black transition flex items-center gap-1 ${
          voted ? "opacity-50 cursor-not-allowed" : ""
        }`}
        aria-label="Like"
      >
        <ThumbsUp size={18} /> {likeCount}
      </button>
      <button
        type="button"
        onClick={() => handleVote("dislike")}
        disabled={!!voted}
        className={`px-2 py-1 rounded bg-[#00000080] border border-[color:var(--color-secondary)] [color:var(--color-secondary)] hover:bg-[color:var(--color-secondary)] hover:text-black transition flex items-center gap-1 ${
          voted ? "opacity-50 cursor-not-allowed" : ""
        }`}
        aria-label="Dislike"
      >
        <ThumbsDown size={18} /> {dislikeCount}
      </button>
    </div>
  );
}
