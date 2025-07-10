"use client";
import { MessageSquare } from "lucide-react";
import { useState } from "react";
import CommentForm from "./comment-form";
import Comments from "./comments";

export default function CommentReplyToggle({ postId, replies }) {
  const [show, setShow] = useState(null); // null, "comments", or "reply"
  const commentCount = replies?.length || 0;

  function handleToggle(type) {
    setShow((prev) => (prev === type ? null : type));
  }

  return (
    <div className="mt-4">
      <div className="border-t border-[#666] pt-1 flex justify-end items-center gap-4 font-mono text-[15px] select-none">
        <div className="flex gap-2 items-center">
          <MessageSquare style={{ color: "var(--color-secondary)" }} />
          <span style={{ color: "var(--color-secondary)", fontWeight: "bold" }}>
            {commentCount}
          </span>
          <button
            type="button"
            style={{
              color:
                show === "comments"
                  ? "var(--color-secondary)"
                  : "var(--color-secondary)",
              fontWeight: show === "comments" ? "bold" : "bold",
              textTransform: "uppercase",
              letterSpacing: "1px",
              background: "none",
              border: "none",
              outline: "none",
              cursor: "pointer",
              fontFamily: "inherit",
              fontSize: "15px",
              padding: 0,
            }}
            onClick={() => handleToggle("comments")}
          >
            Comments
          </button>
        </div>
        <button
          type="button"
          style={{
            color:
              show === "reply"
                ? "var(--color-primary)"
                : "var(--color-primary)",
            fontWeight: show === "reply" ? "bold" : "bold",
            textTransform: "uppercase",
            letterSpacing: "1px",
            background: "none",
            border: "none",
            outline: "none",
            cursor: "pointer",
            fontFamily: "inherit",
            fontSize: "15px",
            padding: 0,
          }}
          onClick={() => handleToggle("reply")}
        >
          Reply
        </button>
      </div>
      <div>
        {show === "comments" && <Comments replies={replies} />}
        {show === "reply" && <CommentForm postId={postId} />}
      </div>
    </div>
  );
}
