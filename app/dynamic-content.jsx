"use client";

import AutoRefresh from "./auto-refresh";
import CommentReplyToggle from "./comment-reply-toggle";
import TrollFessionForm from "./troll-fession-form";
import VoteButtons from "./vote-buttons";

export default function DynamicContent({ initialTop3, initialRecent }) {
  return (
    <>
      <AutoRefresh />

      <TrollFessionForm />

      {/* TOP 3 SECTION */}
      <section className="w-full max-w-2xl mb-10 ">
        <h2 className="text-2xl font-bold text-center mb-6 [color:var(--color-primary)] flex items-center justify-center gap-3">
          {/* Trophy icon left */}
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              style={{ color: "var(--color-secondary)" }}
            >
              <g>
                <path
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 21h8M12 17v4M17 5V3a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v2a5 5 0 0 0 5 5 5 5 0 0 0 5-5zM7 5H5a2 2 0 0 0-2 2v2a5 5 0 0 0 5 5h8a5 5 0 0 0 5-5V7a2 2 0 0 0-2-2h-2"
                />
              </g>
            </svg>
          </span>
          TOP 3 WRONG-FESSIONS OF THE DAY
          {/* Trophy icon right */}
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              style={{ color: "var(--color-secondary)" }}
            >
              <g>
                <path
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 21h8M12 17v4M17 5V3a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v2a5 5 0 0 0 5 5 5 5 0 0 0 5-5zM7 5H5a2 2 0 0 0-2 2v2a5 5 0 0 0 5 5h8a5 5 0 0 0 5-5V7a2 2 0 0 0-2-2h-2"
                />
              </g>
            </svg>
          </span>
        </h2>
        <div className="flex flex-col gap-6">
          {initialTop3.length === 0 && (
            <div className="text-center text-[#aaa]">
              No top wrong-fessions yet.
            </div>
          )}
          {initialTop3.map((troll, idx) => {
            const engagementScore =
              (troll.likes || 0) + (troll.replies?.length || 0);
            return (
              <div
                key={troll._id}
                className="bg-[#00000080] border-2 border-[color:var(--color-primary)] rounded-lg p-4 shadow-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="[color:var(--color-secondary)] font-bold flex items-center gap-2">
                    {/* Icon for top 1, 2, 3 */}
                    {idx === 0 && (
                      <svg
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        style={{ color: "#f9b923" }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z"
                        />
                      </svg>
                    )}
                    {idx === 1 && (
                      <svg
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        style={{ color: "#b0b0b0" }}
                      >
                        <circle cx="12" cy="12" r="10" strokeWidth="2" />
                        <text
                          x="12"
                          y="16"
                          textAnchor="middle"
                          fontSize="12"
                          fill="#b0b0b0"
                          fontWeight="bold"
                        >
                          2
                        </text>
                      </svg>
                    )}
                    {idx === 2 && (
                      <svg
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        style={{ color: "#cd7f32" }}
                      >
                        <circle cx="12" cy="12" r="10" strokeWidth="2" />
                        <text
                          x="12"
                          y="16"
                          textAnchor="middle"
                          fontSize="12"
                          fill="#cd7f32"
                          fontWeight="bold"
                        >
                          3
                        </text>
                      </svg>
                    )}
                    ANONYMOUS WRONG #{idx + 1}
                    <span className="text-xs text-[#aaa] ml-2">
                      (Score: {engagementScore})
                    </span>
                  </span>
                  <span className="text-xs text-[#aaa]">
                    {new Date(troll.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="text-lg mb-3 [color:var(--color-primary)] whitespace-pre-line">
                  {troll.content}
                </div>
                <VoteButtons
                  id={troll._id}
                  likes={troll.likes}
                  dislikes={troll.dislikes}
                />
                <CommentReplyToggle
                  postId={troll._id.toString()}
                  replies={troll.replies}
                />
              </div>
            );
          })}
        </div>
        <div className="text-center text-xs text-[#aaa] mt-4">
          Most upvoted confessions from the past 24 hours • Updates daily from
          Database.
        </div>
      </section>

      {/* RECENT SECTION */}
      <section className="w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-center mb-6 [color:var(--color-primary)]">
          RECENT WRONG-FESSIONS (100)
        </h2>
        <div className="flex flex-col gap-6">
          {initialRecent.length === 0 && (
            <div className="text-center text-[#aaa]">
              No recent wrong-fessions yet.
            </div>
          )}
          {initialRecent.map((troll, idx) => (
            <div
              key={troll._id}
              className="bg-[#00000080] border-2 border-[color:var(--color-primary)] rounded-lg p-4 shadow-lg"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="[color:var(--color-secondary)] font-bold">
                  ANONYMOUS WRONG #{idx + 1 + initialTop3.length}
                </span>
                <span className="text-xs text-[#aaa]">
                  {new Date(troll.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="text-lg mb-3 [color:var(--color-primary)] whitespace-pre-line">
                {troll.content}
              </div>
              <VoteButtons
                id={troll._id}
                likes={troll.likes}
                dislikes={troll.dislikes}
              />
              <CommentReplyToggle
                postId={troll._id.toString()}
                replies={troll.replies}
              />
            </div>
          ))}
        </div>
        <div className="text-center text-xs text-[#aaa] mt-4">
          Showing 100 most recent wrong-fessions
          <br />
          Auto-updates every 15 seconds • Data persists permanently in database
          <br />
          All posts and comments are stored permanently and never disappear
        </div>
      </section>
    </>
  );
}
